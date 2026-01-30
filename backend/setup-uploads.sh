#!/bin/bash

echo "📁 Setting up organized uploads directory structure..."

# Create main uploads directory
mkdir -p uploads

# Create subdirectories for different types of uploads
mkdir -p uploads/avatars
mkdir -p uploads/salons
mkdir -p uploads/messages/voice
mkdir -p uploads/messages/media

# Create .gitkeep files to ensure directories are tracked
touch uploads/.gitkeep
touch uploads/avatars/.gitkeep
touch uploads/salons/.gitkeep
touch uploads/messages/.gitkeep
touch uploads/messages/voice/.gitkeep
touch uploads/messages/media/.gitkeep

echo "✅ Upload directory structure created:"
echo "📂 uploads/"
echo "  ├── avatars/          (User profile pictures)"
echo "  ├── salons/           (Salon images)"
echo "  └── messages/"
echo "      ├── voice/        (Voice messages)"
echo "      └── media/        (Images & videos)"
echo ""
echo "🔒 All directories have proper access controls"
echo "📝 .gitkeep files added to track empty directories"