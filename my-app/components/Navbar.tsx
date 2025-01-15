import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Your App Name
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Links/User Button */}
          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user.firstName || user.username}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
