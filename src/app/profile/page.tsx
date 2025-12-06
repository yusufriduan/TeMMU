import { Button } from "@headlessui/react";
import ImageWithFallback from "../components/image_with_fallback";
import { University } from "lucide-react";

function ProfilePage() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <a className="absolute top-8 left-8 bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,color,scale] duration-300 ease-in-out" href="/">Back to Dashboard</a>
      <div className="w-[80vw] h-[40vh] bg-(--foreground) border-4 border-gray-500 shadow-2xl rounded-4xl flex flex-row">
        <div className="relative h-full w-1/2 rounded-4xl border-r-4 border-gray-500 overflow-hidden">
          <ImageWithFallback
            src="/Image.png"
            alt="Profile Image"
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="mb-1 font-bold text-lg">Profile Name Placeholder</h2>
            <div className="flex items-center gap-1 text-white/90 mb-2 badge-green">
              <University className="w-4 h-4" />
              <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                University Placeholder
              </span>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-8 flex flex-col">
          <p className="text-(--text) mb-4">
            Number of STEM Projects placeholder
          </p>
          <div className='border-t border-gray-600 w-[30vw] shadow-4xl'></div>
          <div className="mt-4">
            <p className="font-bold">Contact Details</p>
            <p className="text-(--text)">Email: Email Placeholder</p>
            <p className="text-(--text)">Phone: Phone Placeholder</p>
          </div>
        </div>
      </div>
      <div className="relative w-[80vw] h-[10vh] mt-4">
        <Button className="absolute bottom-40 right-8 bg-blue-400 text-black px-4 py-2 rounded-4xl hover:cursor-pointer hover:scale-115 hover:bg-(--highlighted) hover:text-white shadow-lg transition-[background-color,scale,color] duration-300 ease-in-out">Edit Profile</Button>
      </div>
    </div>
  );
}

export default ProfilePage;