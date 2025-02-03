const config    =   require('../config');

const NOTIFICATION_DATA_WITH_IMG = {
    "pjp_planned": { "image": "appimages/pjp_planned.png", "subject": "PJP Created/ PJP Assigned", "body": "PJP Created/Assigned" },
    "requests": { "image": "appimages/requests.png", "subject": "Request Raised.", "body": "Take action on the raised request." },
    "new_branding_requisition": { "image": "appimages/new_branding_requisition.png", "subject": "Branding Requisition Raised", "body": "New Branding Request Raised" },
    "task": { "image": "appimages/task.png", "subject": "Task Assigned", "body": "New Task Assigned" },
    "enquiries_leads_assigne_crm": { "image": "appimages/task.png", "subject": "Enquiries/Leads assigned By CRM", "body": "Enquiries/Leads assigned" },
    "new_lead": { "image": "appimages/task.png", "subject": "New Lead Assigned", "body": "New Lead Assigned" },
    "lead_converted_to_opportunity": { "image": "appimages/task.png", "subject": "Lead converted to opportunity", "body": "Lead converted to opportunity." },
    "lead_status_change": { "image": "appimages/task.png", "subject": "Lead status change", "body": "Lead status change." },
    "lead_stage_change": { "image": "appimages/task.png", "subject": "Lead stage change", "body": "Lead stage change." },
    "opportunity_status_change": { "image": "appimages/task.png", "subject": "Opportunity status change", "body": "Opportunity status change." },
    "opportunity_stage_change": { "image": "appimages/task.png", "subject": "Opportunity stage change", "body": "Opportunity stage change." },
    "lead_assigned_to_user": { "image": "appimages/lead.png", "subject": "New Lead Assigned", "body": "New Lead Assigned" },
    "new_visit_done": { "image": "appimages/visitedGreen.png", "subject": "New Visit Created", "body": "New Visit Created" }
}



module.exports = {
    NOTIFICATION_DATA_WITH_IMG: NOTIFICATION_DATA_WITH_IMG
}