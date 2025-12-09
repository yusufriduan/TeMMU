"use client";
import { Button } from "@headlessui/react";
import ImageWithFallback from "./image_with_fallback";
import { University } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

interface profileCardProp {
  id: string;
  mentor_id: string;
  name: string;
  profile_picture: string;
  university: string;
  contribution: number;
}

function ProfileCard({
  id,
  mentor_id,
  name,
  profile_picture,
  university,
  contribution,
}: profileCardProp) {
  const [visible, setVisible] = useState(true);

  async function requestForMentoring() {
    const { data, error } = await supabase
      .from("MenteeList")
      .insert({ mentor: mentor_id, mentee: id, enrolled: false });

    if (error) {
      console.log(error);
    }

    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="profile-card-wrapper w-90">
      <div className="profile-card">
        <div className="relative h-96">
          <ImageWithFallback
            src={profile_picture}
            alt="Profile Image"
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="mb-1 font-bold text-lg">{name}</h2>
            <div className="flex items-center gap-1 text-white/90 mb-2 badge-green">
              <University className="w-4 h-4" />
              <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                {university}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 justify-between flex flex-col">
        <div>
          <p className="text-sm">{contribution} Projects</p>
        </div>
        <div className="flex flex-row justify-around mt-4">
          <Button
            onClick={(e) => requestForMentoring()}
            className={
              "bg-sky-400 p-2 rounded-lg shadow-lg hover:bg-(--hover) hover:scale-110 hover:cursor-pointer data-selected:bg-(--highlighted) transition duration-150 ease-in-out"
            }
          >
            Add Mentor
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
