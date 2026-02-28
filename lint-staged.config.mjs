const cfg = {
  "*.{js,jsx,ts,tsx}": [
    "npm run lint",
    "prettier --write",
    "vitest related --run --passWithNoTests"
  ]
}

export default cfg
