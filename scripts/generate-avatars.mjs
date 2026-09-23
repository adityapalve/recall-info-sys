import { mkdir, writeFile } from 'node:fs/promises'

const avatars = {
  fox: {
    bg: '#f6d9bb',
    ink: '#db5c3d',
    art: `<path fill="#a44858" d="M18 19 40 32 32 53 15 47ZM82 19 60 32 68 53 85 47Z"/><path fill="#dc6b43" d="M21 23 43 35 57 35 79 23 76 68 61 82 39 82 24 68Z"/><path fill="#f8eed8" d="M24 57 42 64 50 59 58 64 76 57 65 80 35 80Z"/><path fill="#2e3540" d="M36 51h4v5h-4zm24 0h4v5h-4z"/><path fill="#51404a" d="m45 66 10 0-5 6z"/>`,
  },
  cat: {
    bg: '#d9d5f6',
    ink: '#5550a0',
    art: `<path fill="#524b8d" d="M21 21 39 31 50 29 61 31 79 21 77 67Q72 83 50 84 28 83 23 67Z"/><path fill="#eb9ab4" d="m26 28 12 9-12 9zm48 0-12 9 12 9z"/><ellipse cx="50" cy="68" rx="18" ry="12" fill="#f7e9e6"/><path fill="#2f3046" d="M35 52q3-5 6 0l-3 5zm24 0q3-5 6 0l-3 5zm-13 14 8 0-4 5z"/><path d="M41 72q9 9 18 0" stroke="#2f3046" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  bunny: {
    bg: '#f7dbe2',
    ink: '#d47e9d',
    art: `<rect x="27" y="7" width="15" height="49" rx="8" fill="#efbdc7" transform="rotate(-12 35 31)"/><rect x="58" y="7" width="15" height="49" rx="8" fill="#efbdc7" transform="rotate(12 65 31)"/><rect x="34" y="16" width="5" height="28" rx="3" fill="#d47e9d" transform="rotate(-12 36 30)"/><rect x="61" y="16" width="5" height="28" rx="3" fill="#d47e9d" transform="rotate(12 63 30)"/><circle cx="50" cy="61" r="29" fill="#fff3e9"/><ellipse cx="37" cy="59" rx="3" ry="4" fill="#424052"/><ellipse cx="63" cy="59" rx="3" ry="4" fill="#424052"/><path fill="#d47e9d" d="m45 69 10 0-5 6z"/><path d="M50 75q-5 9-11 3m11-3q5 9 11 3" stroke="#655762" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  bear: {
    bg: '#f3dea7',
    ink: '#aa6047',
    art: `<circle cx="27" cy="32" r="16" fill="#9b5549"/><circle cx="73" cy="32" r="16" fill="#9b5549"/><circle cx="27" cy="32" r="8" fill="#d99478"/><circle cx="73" cy="32" r="8" fill="#d99478"/><circle cx="50" cy="57" r="31" fill="#bd7352"/><ellipse cx="50" cy="68" rx="17" ry="13" fill="#ebba88"/><circle cx="38" cy="55" r="3" fill="#3d3540"/><circle cx="62" cy="55" r="3" fill="#3d3540"/><ellipse cx="50" cy="65" rx="5" ry="4" fill="#3d3540"/><path d="M50 69v5m0 0q-5 5-9 0m9 0q5 5 9 0" stroke="#3d3540" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  panda: {
    bg: '#c8d9d6',
    ink: '#313943',
    art: `<circle cx="27" cy="30" r="15" fill="#333a44"/><circle cx="73" cy="30" r="15" fill="#333a44"/><circle cx="50" cy="57" r="31" fill="#f7f1df"/><ellipse cx="37" cy="54" rx="10" ry="13" fill="#38414a" transform="rotate(18 37 54)"/><ellipse cx="63" cy="54" rx="10" ry="13" fill="#38414a" transform="rotate(-18 63 54)"/><circle cx="39" cy="54" r="2.5" fill="#f7f1df"/><circle cx="61" cy="54" r="2.5" fill="#f7f1df"/><ellipse cx="50" cy="69" rx="6" ry="4" fill="#38414a"/><path d="M50 72q-6 7-10 1m10-1q6 7 10 1" stroke="#38414a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  frog: {
    bg: '#d6e9b5',
    ink: '#3b9475',
    art: `<circle cx="31" cy="35" r="14" fill="#4aab78"/><circle cx="69" cy="35" r="14" fill="#4aab78"/><ellipse cx="50" cy="60" rx="34" ry="28" fill="#55b984"/><circle cx="31" cy="35" r="7" fill="#f8f2dd"/><circle cx="69" cy="35" r="7" fill="#f8f2dd"/><circle cx="32" cy="35" r="3" fill="#2d3d45"/><circle cx="68" cy="35" r="3" fill="#2d3d45"/><circle cx="37" cy="60" r="2" fill="#387d6c"/><circle cx="63" cy="60" r="2" fill="#387d6c"/><path d="M35 69q15 13 30 0" stroke="#387d6c" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="27" cy="67" r="5" fill="#ed9b92" opacity=".75"/><circle cx="73" cy="67" r="5" fill="#ed9b92" opacity=".75"/>`,
  },
  penguin: {
    bg: '#c9e4ee',
    ink: '#375672',
    art: `<ellipse cx="50" cy="55" rx="29" ry="36" fill="#354b65"/><ellipse cx="50" cy="62" rx="20" ry="26" fill="#f6eee2"/><ellipse cx="38" cy="47" rx="3" ry="4" fill="#263445"/><ellipse cx="62" cy="47" rx="3" ry="4" fill="#263445"/><path fill="#ef9a5d" d="m42 57 16 0-8 9z"/><ellipse cx="31" cy="84" rx="10" ry="4" fill="#ef9a5d"/><ellipse cx="69" cy="84" rx="10" ry="4" fill="#ef9a5d"/><circle cx="31" cy="61" r="5" fill="#eaa4a0" opacity=".6"/><circle cx="69" cy="61" r="5" fill="#eaa4a0" opacity=".6"/>`,
  },
  duck: {
    bg: '#f6e8a7',
    ink: '#e7ad43',
    art: `<circle cx="50" cy="57" r="31" fill="#f3cf66"/><path fill="#f6b54a" d="M18 60q-7 12 0 24l18-10z"/><circle cx="39" cy="53" r="3" fill="#3b3d43"/><circle cx="62" cy="53" r="3" fill="#3b3d43"/><path fill="#e47a57" d="M40 62h20l-3 11-15 0z"/><path d="M41 67h18" stroke="#b95e51" stroke-width="2"/><circle cx="29" cy="66" r="5" fill="#ea9d89" opacity=".7"/><circle cx="71" cy="66" r="5" fill="#ea9d89" opacity=".7"/>`,
  },
  dog: {
    bg: '#ecd7c2',
    ink: '#906450',
    art: `<path fill="#8c6258" d="M23 29Q6 39 17 69l22-16zm54 0q17 10 6 40L61 53z"/><circle cx="50" cy="58" r="29" fill="#f2c990"/><path fill="#ab7258" d="M22 44q9-19 27-15v18q-15 18-27-3"/><ellipse cx="50" cy="69" rx="16" ry="12" fill="#f9e5bf"/><circle cx="39" cy="55" r="3" fill="#3d3540"/><circle cx="62" cy="55" r="3" fill="#3d3540"/><ellipse cx="50" cy="67" rx="5" ry="4" fill="#3d3540"/><path d="M50 72q0 10 8 5" stroke="#3d3540" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  owl: {
    bg: '#dbcde6',
    ink: '#7b5d90',
    art: `<path fill="#7c638e" d="M20 21 36 32Q50 25 64 32l16-11-3 45Q72 86 50 86T23 66Z"/><path fill="#a282a3" d="M29 42q21-20 42 0l-4 26-17 11-17-11z"/><circle cx="38" cy="53" r="13" fill="#f6ead2"/><circle cx="62" cy="53" r="13" fill="#f6ead2"/><circle cx="38" cy="53" r="5" fill="#3a3647"/><circle cx="62" cy="53" r="5" fill="#3a3647"/><path fill="#efb158" d="m44 66 12 0-6 8z"/><path d="M37 82v6m26-6v6" stroke="#efb158" stroke-width="3" stroke-linecap="round"/>`,
  },
}

const target = new URL('../apps/web/public/avatars/', import.meta.url)
await mkdir(target, { recursive: true })
await Promise.all(
  Object.entries(avatars).map(async ([name, { bg, ink, art }]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${name} avatar">
<defs><clipPath id="round"><circle cx="50" cy="50" r="49"/></clipPath><pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="${ink}" opacity=".22"/></pattern></defs>
<g clip-path="url(#round)"><circle cx="50" cy="50" r="50" fill="${bg}"/><path d="M0 74Q42 61 100 75v25H0Z" fill="${ink}" opacity=".17"/><g transform="translate(2.2 1.4)" opacity=".24">${art}</g>${art}<circle cx="50" cy="50" r="50" fill="url(#dots)"/></g><circle cx="50" cy="50" r="49" fill="none" stroke="#f7f1e7" stroke-width="2"/></svg>`
    await writeFile(new URL(`${name}.svg`, target), svg)
  }),
)
