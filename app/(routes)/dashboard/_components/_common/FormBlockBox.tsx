"use client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const FormBlockBox = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="w-full">
      <div className="flex gap-2 py-4 text-sm">
        <Input
          placeholder="Search Blocks"
          className="placeholder:text-gray-400 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-3 w-full">
        <div className="mb-2">
            <h5 className="text-[13px] text-gray-500 font-medium">
                Layout
            </h5>
        </div>
        <Separator color="" className="!bg-gray-200" />
        <div>
            <h5 className="text-[13px] text-gray-500 font-medium">
                Form
            </h5>
        </div>
      </div>
    </div>
  );
};

export default FormBlockBox;
