// filepath: f:\LUT University\Metal Gear\frontend\src\components\LuciaSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./LuciaSection.css";

gsap.registerPlugin(ScrollTrigger);

const LuciaSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    
    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
    
        if (!section || !content) return;
    
        // Create ScrollTrigger for the Lucia section
        const scrollTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom bottom",
            pin: false,
            scrub: 1,
            onUpdate: (self) => {
                // Update content based on scroll progress
                const progress = self.progress;
                
                // You can add animations here based on scroll progress
                // For example, fade in elements or animate images
            },
        });
    
        return () => {
            scrollTrigger.kill();
        };
    }, []);
    
    return (
        <section ref={sectionRef} className="lucia-section">
            <div ref={contentRef} className="lucia-introduction">
                <div className="lucia-text-content">
                    <h1>Lucia Caminos</h1>
                    <h3>Lucia's father taught her to fight as soon as she could walk.</h3>
                    <p>Life has been coming at her swinging ever since. Fighting for her family landed her in the Leonida Penitentiary. Sheer luck got her out. Lucia's learned her lesson — only smart moves from here.</p>
                </div>
                <img 
                    src="Lucia_Caminos_01.jpg" 
                    alt="Lucia Caminos Portrait 1" 
                    className="lucia-image-left"
                />
                <div className="lucia-images-right">
                    <img 
                        src="Lucia_Caminos_02.jpg" 
                        alt="Lucia Caminos Portrait 2"
                    />
                    <img 
                        src="Lucia_Caminos_03.jpg" 
                        alt="Lucia Caminos Portrait 3"
                    />
                </div>
            </div>
        </section>
    );
};

export default LuciaSection;
