const generateSVG = (text: string) => {
  text = text.replace('ø', "o");

  const svg = `
      <svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="150" fill="#F3F4F6"/>
        <text x="150" y="75" font-family="Arial" font-size="14" fill="#9CA3AF" text-anchor="middle" dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `;
  return "data:image/svg+xml;base64," + btoa(svg);
};

export default generateSVG;
