import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="text-black font-bold text-2xl">
            Medical Chat Bot
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/protected"
            prefetch={false} 
            className="border-black bg-black text-white hover:bg-white hover:text-black flex h-10 px-3 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
          >
            Access the chatbot 
          </Link>
        </div>
      </div>
    </div>
  );
}
