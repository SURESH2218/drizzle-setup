import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../models/user.model.js";
import { Webhook } from "svix";
import { v4 as uuidv4 } from 'uuid';

export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    console.log("Webhook received - Starting processing");
    
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error("Missing CLERK_WEBHOOK_SECRET");
      return res.status(400).json({ error: "Missing webhook secret" });
    }

    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing required Svix headers");
      return res.status(400).json({ error: "Missing svix headers" });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    
    try {
      const evt = wh.verify(JSON.stringify(req.body), {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });

      console.log("Webhook verified successfully");
      console.log("Event type:", evt.type);

      if (evt.type === "user.created") {
        const userData = evt.data;
        
        // Prepare user data according to schema
        const newUserData = {
          id: uuidv4(), // Generate a UUID for primary key
          clerkId: userData.id,
          email: userData.email_addresses[0]?.email_address,
          username: userData.username || null,
          firstName: userData.first_name || null,
          lastName: userData.last_name || null,
          // createdAt and updatedAt will be handled by defaultNow()
        };

        console.log("Preparing to insert user:", newUserData);

        // Check for existing user
        const existingUser = await db.query.users.findFirst({
          where: eq(users.clerkId, userData.id),
        });

        if (existingUser) {
          console.log("Updating existing user:", existingUser.id);
          await db
            .update(users)
            .set({
              email: newUserData.email,
              username: newUserData.username,
              firstName: newUserData.firstName,
              lastName: newUserData.lastName,
              updatedAt: new Date(),
            })
            .where(eq(users.clerkId, userData.id));
        } else {
          console.log("Creating new user with ID:", newUserData.id);
          await db.insert(users).values(newUserData);
        }
        
        console.log("User processing completed successfully");
      }

      return res.status(200).json({ success: true });
    } catch (verifyError) {
      console.error("Webhook verification failed:", verifyError);
      return res.status(400).json({ 
        error: "Webhook verification failed",
        details: verifyError.message 
      });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ 
      error: "Webhook processing failed",
      details: error.message 
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const clerkId = req.headers["x-clerk-user-id"];

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId as string),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};
