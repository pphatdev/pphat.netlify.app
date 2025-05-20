# Contact Form Email Setup

This document explains how to configure the email functionality for the contact form using Gmail.

## Configuration Options

The contact form sends emails using Gmail's SMTP server via Nodemailer. This requires setting up an app password in your Google account.

### Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
# Gmail configuration
GMAIL_USER=info.sophat@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
```

## Gmail App Password Setup

To use Gmail to send emails from your application, you need to create an App Password:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security" from the left navigation
3. Under "Signing in to Google", select "2-Step Verification" (you must have this enabled)
4. At the bottom of the page, select "App passwords"
5. Click "Select app" and choose "Mail"
6. Click "Select device" and choose "Other"
7. Enter a name for the app password (e.g., "My Website Contact Form")
8. Click "Generate"
9. Google will display a 16-character app password. Copy this password.
10. Add it to your `.env.local` file as the `GMAIL_APP_PASSWORD` value

## Email Configuration

The contact form is configured to:

1. Receive form submissions from website visitors
2. Send them to `info.sophat@gmail.com`
3. Include the sender's email in the "Reply-To" field so you can easily respond
4. Format the message in a readable HTML layout

## Testing

To test if your email configuration is working:

1. Fill out the contact form on your website
2. Check the console for any error messages
3. Check your email (info.sophat@gmail.com) to see if you received the test message

## Troubleshooting

- If emails are not sending, check that your app password is correctly entered in the `.env.local` file
- Make sure 2-Step Verification is enabled for your Google account
- If you see "Invalid login credentials" errors, regenerate your app password
- Check that `info.sophat@gmail.com` is correctly set up and accessible
- Verify there are no Gmail sending limits being hit (Google limits the number of emails you can send per day)
- Check the server logs for detailed error messages

## Security Notes

- Never commit your `.env.local` file or any file containing app passwords to version control
- Consider implementing additional spam protection measures like reCAPTCHA
- Regularly rotate your app password for better security
- Monitor your sent emails to detect any unauthorized use
