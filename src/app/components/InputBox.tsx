"use client";
import { useRef } from "react";

interface inputBoxProp {
  icon: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholderText: string;
  width: number;
  height: number;
}

export default function InputBox({
  icon,
  value,
  onChange,
  placeholderText,
  width,
  height,
}: inputBoxProp) {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };
  return (
    <div
      id="input-box-cont"
      onClick={focusInput}
      className={`mb-4 flex flex-row items-center border-2 rounded-lg border-black w-${width} h-${height} transition delay-150 duration-300 ease-in-out hover:border-blue-400`}
    >
      <span
        onClick={focusInput}
        className={`w-1/6 h-4/5 rounded-xl flex justify-center items-center`}
      >
        <img src={icon} className="w-fit h-fit"></img>
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholderText}
        className={`border-0 w-5/6 h-full outline-none cursor-pointer`}
      ></input>
    </div>
  );
}
