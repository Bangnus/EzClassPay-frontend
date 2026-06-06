"use client";

export default function Navbar() {
  return (
    <div className="container mx-auto mt-5 rounded-lg border border-border bg-primary p-4 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Navbar</h1>
        <div className="">
          <ul className="flex gap-4">
            <li className="cursor-pointer transition-colors duration-300 hover:text-secondary-light">
              Home
            </li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-secondary-light">
              About
            </li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-secondary-light">
              Contact
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
