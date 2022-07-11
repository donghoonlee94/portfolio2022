import gsap from 'gsap';
import { RoughEase } from 'gsap/EasePack';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin, RoughEase);

const words = [
  '안녕하세요. 프론트엔드 개발자 이동훈입니다.',
  '이 페이지는 WebGL을 사용하여 개발되었습니다.',
  '스크롤 및 우측 하단 버튼을 이용하여 화면을 이동할 수 있습니다.',
];

const textAnimation = () => {
  let cursor = gsap.to('.cursor', { opacity: 0, ease: 'power2.inout', repeat: -1 });
  let masterTL = gsap.timeline({ repeat: -1 });

  words.forEach((word) => {
    let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
    tl.to('.text', { duration: 3, text: word });
    masterTL.add(tl);
  });
};

export { textAnimation };
