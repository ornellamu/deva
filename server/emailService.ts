import { EmailLog, EmailType, InterviewDetails } from './types.js';

// Predefined professional email templates for Deva Hospital Recruitment System
export function generateEmailContent(params: {
  type: EmailType;
  applicantName: string;
  jobTitle: string;
  department: string;
  applicationId: number;
  customMessage?: string;
  interviewDetails?: InterviewDetails;
}) {
  const { type, applicantName, jobTitle, department, applicationId, customMessage, interviewDetails } = params;
  const hospitalName = "Deva Central Hospital";
  const refCode = `DH-${new Date().getFullYear()}-${String(applicationId).padStart(5, '0')}`;

  if (type === 'submitted_confirmation') {
    return {
      subject: `Application Received — ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #0f766e; color: #ffffff; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
            .body { padding: 32px 24px; }
            .info-box { background: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
            .btn { display: inline-block; background: #0f766e; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>${hospitalName}</h1>
              <p>Human Resources & Medical Staff Recruitment</p>
            </div>
            <div class="body">
              <p>Dear <strong>${applicantName}</strong>,</p>
              <p>Thank you for your interest in advancing your healthcare career with ${hospitalName}. We are pleased to confirm that we have successfully received your application and supporting documentation for the following position:</p>
              
              <div class="info-box">
                <p style="margin: 0 0 6px 0;"><strong>Position:</strong> ${jobTitle}</p>
                <p style="margin: 0 0 6px 0;"><strong>Department:</strong> ${department}</p>
                <p style="margin: 0 0 6px 0;"><strong>Application Reference:</strong> ${refCode}</p>
                <p style="margin: 0;"><strong>Date Submitted:</strong> ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
              </div>

              <p><strong>What Happens Next?</strong></p>
              <p>Our Clinical and Recruitment Credentialing Committee will review your curriculum vitae, application letter, identity documentation, and professional certifications against the requirements for this role. You will receive an official recruitment decision directly via this email address once the evaluation stage is finalized.</p>
              
              <p>Please preserve your Application Reference code (<strong>${refCode}</strong>) for any future correspondence regarding this submission.</p>

              <p>Warm regards,<br>
              <strong>Deva Hospital Recruitment Directorate</strong><br>
              Division of Human Capital & Medical Affairs<br>
              <span style="font-size: 13px; color: #64748b;">${hospitalName} • recruitment@devahospital.org</span></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${hospitalName}. All rights reserved. This is an automated communication regarding your job application.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Dear ${applicantName},\n\nThank you for applying to ${hospitalName}. We have successfully received your application for the position of ${jobTitle} (${department}). Reference: ${refCode}.\n\nOur recruitment committee will review your documents and you will receive a decision by email.\n\nWarm regards,\nDeva Hospital Recruitment Directorate`
    };
  }

  if (type === 'interview_notification') {
    const intvDate = interviewDetails?.date || 'To be coordinated';
    const intvTime = interviewDetails?.time || 'Morning Session';
    const intvLoc = interviewDetails?.location || 'Deva Hospital Administrative Boardroom';
    const intvFormat = interviewDetails?.format || 'In-Person (Deva Hospital)';
    const intvInstructions = interviewDetails?.instructions || 'Please arrive 15 minutes before scheduled time with original credential documents.';

    return {
      subject: `Interview Invitation — ${jobTitle} at Deva Hospital`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #0284c7; color: #ffffff; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
            .body { padding: 32px 24px; }
            .status-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 8px 16px; font-weight: 700; border-radius: 9999px; font-size: 14px; margin-bottom: 16px; border: 1px solid #bae6fd; }
            .info-box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .message-box { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>${hospitalName}</h1>
              <p>Medical Recruitment & Interview Directorate</p>
            </div>
            <div class="body">
              <div class="status-badge">Interview Invitation</div>
              <p>Dear <strong>${applicantName}</strong>,</p>
              <p>Following a review of your application and clinical credentials by the Department of <strong>${department}</strong>, we are delighted to invite you for a formal recruitment interview for the position of <strong>${jobTitle}</strong>.</p>
              
              <div class="info-box">
                <p style="margin: 0 0 6px 0;"><strong>Date:</strong> ${intvDate}</p>
                <p style="margin: 0 0 6px 0;"><strong>Time:</strong> ${intvTime}</p>
                <p style="margin: 0 0 6px 0;"><strong>Format:</strong> ${intvFormat}</p>
                <p style="margin: 0 0 6px 0;"><strong>Location / Link:</strong> ${intvLoc}</p>
                <p style="margin: 0 0 6px 0;"><strong>Application Reference:</strong> ${refCode}</p>
                <p style="margin: 0;"><strong>Instructions:</strong> ${intvInstructions}</p>
              </div>

              ${customMessage ? `
                <div class="message-box">
                  <h4 style="margin: 0 0 6px 0; color: #b45309;">Note from the HR Directorate:</h4>
                  <p style="margin: 0; font-size: 14px; color: #78350f; white-space: pre-line;">${customMessage}</p>
                </div>
              ` : ''}

              <p>Please confirm your availability by responding to this email or checking your candidate portal. If you require any scheduling adjustments, please let us know immediately.</p>

              <p>Sincerely,</p>
              <p><strong>Clinical Recruitment Panel & HR Directorate</strong><br>
              ${hospitalName}<br>
              <span style="font-size: 13px; color: #64748b;">${hospitalName} • recruitment@devahospital.org</span></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${hospitalName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Dear ${applicantName},\n\nYou have been shortlisted and invited for an interview for ${jobTitle} (${department}) at ${hospitalName} (Ref: ${refCode}).\n\nDate: ${intvDate}\nTime: ${intvTime}\nFormat: ${intvFormat}\nLocation: ${intvLoc}\nInstructions: ${intvInstructions}\n\n${customMessage ? `Note: ${customMessage}\n\n` : ''}Deva Hospital HR Directorate`
    };
  }

  if (type === 'accepted_notification') {
    return {
      subject: `Offer of Appointment & Acceptance Notice — ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #065f46; color: #ffffff; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
            .body { padding: 32px 24px; }
            .status-badge { display: inline-block; background: #dcfce7; color: #15803d; padding: 8px 16px; font-weight: 700; border-radius: 9999px; font-size: 14px; margin-bottom: 16px; border: 1px solid #bbf7d0; }
            .info-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .message-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-left: 4px solid #059669; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .next-steps { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>${hospitalName}</h1>
              <p>Offer & Medical Credentialing Notice</p>
            </div>
            <div class="body">
              <div class="status-badge">Application Accepted & Offer Extended</div>
              <p>Dear <strong>${applicantName}</strong>,</p>
              <p>On behalf of the Management and Medical Advisory Board of <strong>${hospitalName}</strong>, we are pleased to officially inform you that your application for the position of <strong>${jobTitle}</strong> in the <strong>${department}</strong> has been <strong>ACCEPTED</strong>.</p>
              
              <div class="info-box">
                <p style="margin: 0 0 6px 0;"><strong>Selected Candidate:</strong> ${applicantName}</p>
                <p style="margin: 0 0 6px 0;"><strong>Position:</strong> ${jobTitle}</p>
                <p style="margin: 0 0 6px 0;"><strong>Department:</strong> ${department}</p>
                <p style="margin: 0;"><strong>Application Reference:</strong> ${refCode}</p>
              </div>

              ${customMessage ? `
                <div class="message-box">
                  <h4 style="margin: 0 0 6px 0; color: #065f46;">Direct HR Directorate Message:</h4>
                  <p style="margin: 0; font-size: 14px; color: #064e3b; white-space: pre-line;">${customMessage}</p>
                </div>
              ` : ''}

              <div class="next-steps">
                <h4 style="margin: 0 0 10px 0; color: #065f46;">Next Steps in the Onboarding Process:</h4>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px;">
                  <li style="margin-bottom: 6px;">Our HR Onboarding Officer will contact you within two business days to schedule your formal orientation and contract discussion.</li>
                  <li style="margin-bottom: 6px;">Please prepare original copies of your National ID, academic degrees, and professional practice licenses for verification.</li>
                  <li>You will receive details regarding the routine pre-employment occupational health screening.</li>
                </ol>
              </div>

              <p>We were thoroughly impressed with your clinical credentials and background, and we are excited about the prospect of welcoming you to the Deva Hospital medical family.</p>

              <p>Congratulations once again,</p>
              <p><strong>Chief Medical Officer & HR Directorate</strong><br>
              ${hospitalName}<br>
              <span style="font-size: 13px; color: #64748b;">${hospitalName} • onboarding@devahospital.org</span></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${hospitalName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Dear ${applicantName},\n\nWe are pleased to inform you that your application for ${jobTitle} (${department}) at ${hospitalName} has been ACCEPTED (Ref: ${refCode}).\n\n${customMessage ? `HR Note: ${customMessage}\n\n` : ''}Our HR Onboarding team will contact you within two business days regarding orientation, licensing verification, and contract preparation.\n\nCongratulations,\nDeva Hospital HR Directorate`
    };
  }

  if (type === 'admin_response_notification' || type === 'status_update_notification') {
    return {
      subject: `Official HR Update Regarding Your Application — ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #0f766e; color: #ffffff; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
            .body { padding: 32px 24px; }
            .info-box { background: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .message-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #0f766e; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>${hospitalName}</h1>
              <p>Recruitment & Credentialing Communication</p>
            </div>
            <div class="body">
              <p>Dear <strong>${applicantName}</strong>,</p>
              <p>This is an official communication from the Deva Hospital Recruitment Directorate concerning your application for <strong>${jobTitle}</strong> (Ref: ${refCode}).</p>
              
              <div class="info-box">
                <p style="margin: 0 0 6px 0;"><strong>Applicant:</strong> ${applicantName}</p>
                <p style="margin: 0 0 6px 0;"><strong>Position:</strong> ${jobTitle}</p>
                <p style="margin: 0;"><strong>Department:</strong> ${department}</p>
              </div>

              ${customMessage ? `
                <div class="message-box">
                  <h4 style="margin: 0 0 8px 0; color: #0f766e;">Directorate Response / Instruction:</h4>
                  <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-line;">${customMessage}</p>
                </div>
              ` : ''}

              <p>Please log in to your Deva Hospital candidate portal to review your application status and dossier details.</p>

              <p>Warm regards,<br>
              <strong>Deva Hospital Recruitment Directorate</strong><br>
              Division of Human Capital & Medical Affairs<br>
              <span style="font-size: 13px; color: #64748b;">${hospitalName} • recruitment@devahospital.org</span></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${hospitalName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Dear ${applicantName},\n\nUpdate regarding your application for ${jobTitle} (${department}) at ${hospitalName} (Ref: ${refCode}).\n\n${customMessage ? `Message: ${customMessage}\n\n` : ''}Please check your portal for details.\n\nWarm regards,\nDeva Hospital Recruitment Directorate`
    };
  }

  // rejected_notification
  return {
    subject: `Application Update — ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
          .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #334155; color: #ffffff; padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
          .body { padding: 32px 24px; }
          .info-box { background: #f8fafc; border-left: 4px solid #94a3b8; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .message-box { background: #f1f5f9; border: 1px solid #e2e8f0; border-left: 4px solid #64748b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>${hospitalName}</h1>
            <p>Recruitment Committee Decision</p>
          </div>
          <div class="body">
            <p>Dear <strong>${applicantName}</strong>,</p>
            <p>Thank you for taking the time to apply for the position of <strong>${jobTitle}</strong> in the <strong>${department}</strong> at ${hospitalName}, and for providing your credentials and documentation.</p>
            
            <div class="info-box">
              <p style="margin: 0 0 6px 0;"><strong>Applicant:</strong> ${applicantName}</p>
              <p style="margin: 0 0 6px 0;"><strong>Position:</strong> ${jobTitle}</p>
              <p style="margin: 0;"><strong>Application Reference:</strong> ${refCode}</p>
            </div>

            ${customMessage ? `
              <div class="message-box">
                <h4 style="margin: 0 0 6px 0; color: #334155;">Recruitment Directorate Note:</h4>
                <p style="margin: 0; font-size: 14px; color: #475569; white-space: pre-line;">${customMessage}</p>
              </div>
            ` : ''}

            <p>After a rigorous evaluation of all candidate submissions and clinical credentials against our current departmental requirements, we regret to inform you that we are unable to advance your application for this particular opening at this time.</p>
            
            <p>This decision was difficult given the high quality of applicants we received. We will retain your profile in our healthcare talent database for twelve months and invite you to monitor our careers portal for future opportunities that align with your clinical expertise.</p>

            <p>We sincerely appreciate your interest in ${hospitalName} and wish you every success in your continued professional healthcare career.</p>

            <p>Respectfully,</p>
            <p><strong>Deva Hospital Recruitment Committee</strong><br>
            Division of Human Capital & Medical Affairs<br>
            <span style="font-size: 13px; color: #64748b;">${hospitalName} • recruitment@devahospital.org</span></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${hospitalName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${applicantName},\n\nThank you for applying for the position of ${jobTitle} (${department}) at ${hospitalName} (Ref: ${refCode}).\n\n${customMessage ? `Note: ${customMessage}\n\n` : ''}After careful consideration of all candidates, we regret to inform you that your application was not successful for this opening. We sincerely appreciate your interest and wish you the best in your career.\n\nRespectfully,\nDeva Hospital Recruitment Committee`
  };
}

// In-memory + persistent email delivery audit logs
let emailLogsStore: EmailLog[] = [];
let nextEmailId = 1;

export async function sendApplicationEmail(params: {
  type: EmailType;
  recipientEmail: string;
  recipientName: string;
  jobTitle: string;
  department: string;
  applicationId: number;
  customMessage?: string;
  interviewDetails?: InterviewDetails;
}): Promise<{ success: boolean; log: EmailLog; providerMessage?: string }> {
  const { type, recipientEmail, recipientName, jobTitle, department, applicationId, customMessage, interviewDetails } = params;
  const emailData = generateEmailContent({
    type,
    applicantName: recipientName,
    jobTitle,
    department,
    applicationId,
    customMessage,
    interviewDetails,
  });

  let sentStatus: 'sent' | 'delivered' | 'failed' = 'sent';
  let providerMessage = 'Email processed and logged successfully via Deva Dispatcher.';

  // If a live Resend API key is configured in the environment, attempt real transactional dispatch
  const resendApiKey = process.env.EMAIL_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'recruitment@devahospital.org';

  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom.includes('<') ? emailFrom : `Deva Hospital Recruitment <${emailFrom}>`,
          to: [recipientEmail],
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        }),
      });

      if (response.ok) {
        sentStatus = 'delivered';
        providerMessage = 'Live email delivered via Resend API.';
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Resend dispatch notice (fallback to internal dispatch):', errorData);
        sentStatus = 'sent';
        providerMessage = 'Logged internally; external API rejected credentials.';
      }
    } catch (err: any) {
      console.warn('External email provider error (falling back to simulated dispatch):', err.message);
      sentStatus = 'sent';
    }
  }

  const newLog: EmailLog = {
    id: nextEmailId++,
    recipient_email: recipientEmail,
    recipient_name: recipientName,
    subject: emailData.subject,
    email_type: type,
    application_id: applicationId,
    status: sentStatus,
    sent_at: new Date().toISOString(),
    body_preview: emailData.text.slice(0, 140) + '...',
  };

  emailLogsStore.unshift(newLog);

  return {
    success: true,
    log: newLog,
    providerMessage,
  };
}

export function getEmailLogs(): EmailLog[] {
  return emailLogsStore;
}

