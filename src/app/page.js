import Image from "next/image";
import Link from "next/link";
import logoNoBackground from "@/assets/chesslogo/png/logoNoBackground.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-600">
      <h1 className="text-6xl text-white">Welcome to Chess Dz</h1>
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        <Image src={logoNoBackground} alt="logo" />
      </div>
      <Link href="/play">
        <div className="px-8 py-4 bg-[#5EBC67] text-slate-600 font-bold rounded-lg">
          Play Now
        </div>
      </Link>
    </main>
  );
}
