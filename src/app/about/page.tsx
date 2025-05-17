"use client";

import React, { useEffect, useState } from "react";
import { NavigationBar } from "@components/navbar/navbar";
import { AboutMeHero } from "@components/heros/about-hero";

const Posts = () => {
    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <NavigationBar />
            <AboutMeHero />
        </main>
    )
};

export default Posts;