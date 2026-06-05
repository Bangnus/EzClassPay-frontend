"use client";

export default function Navbar() {
  return (
    <div className="container mx-auto p-4 bg-red-500 rounded-2xl mt-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Navbar</h1>
        <div className="">
          <ul className="flex gap-4">
            <li className="cursor-pointer hover:text-white transition-colors duration-300">Home</li>
            <li className="cursor-pointer hover:text-white transition-colors duration-300">About</li>
            <li className="cursor-pointer hover:text-white transition-colors duration-300">Contact</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
