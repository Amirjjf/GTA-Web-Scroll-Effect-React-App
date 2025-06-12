import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./LuciaSection.css";

gsap.registerPlugin(ScrollTrigger);

const LuciaSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const rightImagesRef = useRef(null);
    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const rightImages = rightImagesRef.current;
    
        if (!section || !content) return;

        // Check if user is on mobile device
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;

        // Initially set content to be invisible
        gsap.set(content, {
            opacity: 0,
            y: 50,
        });

        // Initially set right images with no transform (parallax will handle it)
        if (rightImages) {
            gsap.set(rightImages, {
                y: 0,
            });
        }
    
        // Create ScrollTrigger for the main content fade-in
        const fadeInTrigger = ScrollTrigger.create({
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
                    y: 50 - (progress * 50), // Move from 50px down to original position
                });
            }
        });

        // Create separate ScrollTrigger for parallax effect throughout the entire section
        // Use consistent animation speeds for all devices
        const parallaxTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            pin: false,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Animate right images with consistent speed across all devices
                // Adjusted movement based on device size for better UX
                if (rightImages) {
                    let parallaxDistance;
                    if (isSmallMobile) {
                        parallaxDistance = -80; // Less movement for small mobile
                    } else if (isMobile) {
                        parallaxDistance = -120; // Medium movement for tablets
                    } else {
                        parallaxDistance = -200; // Full movement for desktop
                    }
                    
                    gsap.set(rightImages, {
                        y: progress * parallaxDistance,
                    });
                }
            }
        });

        // Handle window resize to update mobile detection and refresh ScrollTrigger
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', handleResize);
    
        return () => {
            fadeInTrigger.kill();
            parallaxTrigger.kill();
            window.removeEventListener('resize', handleResize);
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
                <div className="lucia-images-right" ref={rightImagesRef}>
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