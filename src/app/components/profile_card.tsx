"use client";
import ImageWithFallback from "./image_with_fallback";
import { MapPin } from "lucide-react";

function ProfileCard() {
  return (
    <div className="profile-card-wrapper w-90">
      <div className="profile-card">
        <div className="relative h-96">
          <ImageWithFallback
            src="/Image.png"
            alt="Profile Image"
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="mb-1 font-bold text-lg">Profile Name Placeholder</h2>
            <div>
              <p className="text-sm">Number of STEM Projects placeholder</p>
            </div>
            <div className="flex items-center gap-1 text-white/90 mb-2 badge-green">
              <MapPin className="w-4 h-4" />
              <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                Location Placeholder
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 justify-between flex flex-col">
        <div>
          <p>User Description placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
