
# Deployment Guide for HostGator Brazil

This guide will help you deploy your React application to HostGator Brazil's shared hosting.

## Prerequisites

- HostGator Brazil hosting account
- FTP client (like FileZilla) or access to HostGator's file manager
- Node.js installed on your local machine

## Build Process

1. Open your terminal/command prompt
2. Navigate to your project directory
3. Run the build command:
   ```
   npm run build
   ```
4. This will create a `dist` folder with your production-ready files

## Uploading to HostGator

1. Connect to your HostGator account using FTP or the file manager
2. Navigate to the public_html directory (or the directory where you want to host the site)
3. Upload all contents from your local `dist` folder to this directory

## Setting up for Client-Side Routing

The `.htaccess` file is already included in your project and will be uploaded with the rest of the files. This handles redirects for client-side routing.

## Testing Your Deployment

1. Visit your domain in a web browser
2. Navigate to different pages to ensure routing works properly
3. Test all functionality, especially the Supabase integration

## Troubleshooting

- If routes don't work, ensure the `.htaccess` file was uploaded correctly
- If API calls fail, check your Supabase configuration
- For any server errors, check the error logs in your HostGator control panel

## Note on Environment Variables

The Supabase URL and key are compiled into your application during the build process. If you need to change these later, you'll need to update them in your code and rebuild the application.
