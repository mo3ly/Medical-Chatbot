import { getServerSession } from "next-auth/next";

export default async function AuthStatus() {
  const session = await getServerSession();
  return (
    <div className="absolute top-5 w-full flex justify-center items-center">
      {session && (
        <p className="text-gray-500 text-sm -mt-2">
          Signed in as {session.user?.email}
        </p>
      )}
    </div>
  );
}
