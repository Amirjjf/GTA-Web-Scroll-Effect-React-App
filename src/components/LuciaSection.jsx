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

        // Initially set content to be invisible
        gsap.set(content, {
            opacity: 0,
            y: 50,
        });
    
        // Create ScrollTrigger for the Lucia section
        const scrollTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            pin: false,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Smoothly animate content opacity and position based on scroll progress
                gsap.set(content, {
                    opacity: progress,
                    y: 50 - (progress * 50), // Move from y: 50 to y: 0
                });
            }
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