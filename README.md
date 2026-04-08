# CarDetl.io - Faceless AI Video Generator for Auto Detailers

AI-powered faceless video generator for auto detailers and car washes. Upload before/after photos → get viral TikTok/Reels/Shorts transformation videos.

## Features

- 🚗 Upload before/after vehicle photos
- 🎬 AI-generated transformation videos
- 📱 Multi-platform publishing (TikTok, Instagram, YouTube)
- 🎵 5 detailing-style presets (Showroom, CleanCrew, Midnight, Family, Budget)
- 🪝 AI-generated viral hooks and hashtags
- 🎤 Text-to-speech voiceovers

## Tech Stack

- NestJS + TypeScript
- MongoDB + Mongoose
- GraphQL (Apollo)
- FFmpeg for video rendering
- OpenAI GPT-4o-mini + TTS-1
- Cloudinary for media storage

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=mongodb://localhost:27017/cardetl
# OPENAI_API_KEY=sk-your-key
# CLOUDINARY_* credentials

# Run development server
npm run start:dev
```

## GraphQL Playground

Open http://localhost:3000/graphql after starting the server.

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string |
| OPENAI_API_KEY | OpenAI API key for hook generation |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| TIKTOK_APP_ID | TikTok app ID |
| TIKTOK_APP_SECRET | TikTok app secret |
| INSTAGRAM_APP_ID | Instagram app ID |
| INSTAGRAM_APP_SECRET | Instagram app secret |

## Video Templates

1. **SHOWROOM** - Cinematic, dramatic lighting, luxury car energy
2. **CLEANCREW** - Bright, fresh, "freshly detailed" vibes
3. **MIDNIGHT** - Dark moody, neon accents, street racing aesthetic
4. **FAMILY** - Warm, trustworthy, "your family car deserves this"
5. **BUDGET** - Quick turnaround, high-volume shop aesthetic
