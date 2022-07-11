import gsap from"gsap";const menuBtn=document.querySelector(".menu-btn"),menuFirst=document.querySelectorAll(".menu-toggle:first-child"),menuLast=document.querySelectorAll(".menu-toggle:last-child"),menuMiddle=document.querySelectorAll(".menu-toggle:nth-child(2)"),navBody=document.querySelector(".nav-body"),navBodyItems=document.querySelectorAll(".nav-body__item"),body=document.body;let isClicked=!1;const tlBtn=gsap.timeline({duration:.5,paused:!0});tlBtn.to(menuFirst,{rotation:45,transformOrigin:"50% 50%",x:-3,y:8,backgroundColor:"#565656"}).to(menuLast,{rotation:-45,transformOrigin:"-50% 50%",x:5,y:12,backgroundColor:"#565656"},"<").to(menuMiddle,{x:100,opacity:0},"<");const tlNav=gsap.from(navBody,{paused:!0,duration:.8,opacity:0}),tNavItems=gsap.from(navBodyItems,{paused:!0,duration:.8,opacity:0,stagger:.2,y:500}),menuAnimation=()=>{tlBtn.reversed()?tlBtn.play():tlBtn.reverse(),tlNav.reversed()?tlNav.play():tlNav.reverse(),tNavItems.reversed()?tNavItems.play():tNavItems.reverse(),menuBtn.addEventListener("click",(()=>{isClicked=!isClicked,body.style=isClicked?"overflow: hidden":"overflow: scroll",tlBtn.reversed()?tlBtn.play():tlBtn.reverse(),tlNav.reversed()?tlNav.play():tlNav.reverse(),tNavItems.reversed()?tNavItems.play():tNavItems.reverse()}))};export{menuAnimation};