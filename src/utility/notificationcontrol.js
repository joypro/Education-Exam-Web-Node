const notificationModel = require('../model/notificationManagement_model');
const notificationcontent = require('../constant/notificationcontent');



module.exports.sendTaskAssignedNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "taskAssigned";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["task"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["task"].body;
		data["body"] = data.assignerName + " has assigned a task for you ";
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["task"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}



module.exports.sendEnquiriesLeadsAssignedByCrmNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "EnquiryLeadAssigned";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["enquiries_leads_assigne_crm"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["enquiries_leads_assigne_crm"].body;
		data["body"] = data.assignerName + " has assigned a enquiry for you with due date " + data.assignDueDate ;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["enquiries_leads_assigne_crm"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}


module.exports.sendNewLeadNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "addNewLead";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].body;
		data["body"] = data.assignerName + " has assigned a new lead for you ";
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}


module.exports.sendLeadConvertedToOpportunityNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "leadToOpportunity";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_converted_to_opportunity"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_converted_to_opportunity"].body;
		data["body"] = "Lead ( "+data.opportunityName+" ) converted to oppertunity" ;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_converted_to_opportunity"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}



module.exports.sendLeadStatusChangeNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "leadStatusChange";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_status_change"].subject;
		data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_status_change"].body;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_status_change"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}


module.exports.sendOpportunityStatusChangeNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "opportunityStatusChange";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["opportunity_status_change"].subject;
		data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["opportunity_status_change"].body;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["opportunity_status_change"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}

module.exports.sendOpportunityStageChangeNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		// data["refType"] = "opportunityStageChange";
		data["refType"] = "opportunityToCustomer";
		data["refId"] = data.refId ? data.refId : "0";
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["opportunity_stage_change"].subject;
		data["subject"] = "Oppertunity converted to customer ";
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["opportunity_stage_change"].body;
		data["body"] = " You have converted an oppertunity to customer ";
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["opportunity_stage_change"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}


module.exports.sendLeadAssignedToUserNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "leadAssignUpdate";
		data["refId"] = data.refId ? data.refId : "0";
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_assigned_to_user"].subject;
		data["subject"] = "Lead Assigned";
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_assigned_to_user"].body;
		data["body"] = data.assignerName + " has assigned a lead for you, remarks as : ' "+data.assignRemarks+" ' ";
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_assigned_to_user"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}

module.exports.sendLeadAssignedRemarksToUserNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "leadAssignRemarksUpdate";
		data["refId"] = data.refId ? data.refId : "0";
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_assigned_to_user"].subject;
		data["subject"] = "Assign Remarks Updated";
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_assigned_to_user"].body;
		data["body"] = data.assignerName + " has updated assign remarks as : ' "+data.assignRemarks+" '";
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["lead_assigned_to_user"].image;
		data["type"] = "bell";
		data["status"] = "1";
		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}

module.exports.sendfieldVisitNotificationToUser = async (data, receiverUserId) => {
	try {

		data["receiverUserId"] = receiverUserId;
		data["refType"] = "fieldVisitNotification";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = "Field Visit Notification";
		data["body"] = data.textMsg;
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].body;
		// data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].image;
		data["type"] = "bell";
		data["status"] = "1";

		await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}

module.exports.sendLeadRemainderNotification = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "LeadReminder";
		data["refId"] = data.refId ? data.refId : "0";
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].body;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].image;
		data["subject"] = "Reminder Notification From " + data.assignerName;
		data["body"] = data.textMsg;
		data["type"] = "bell";
		data["status"] = "1";
		let notificationId = await notificationModel.addPushNotification(data);
		return (true);
	} catch (err) {

		return (err)
	}
}

module.exports.sendLeadRemainderNotificationV2 = async (data, receiverUserId) => {
	try {
		data["receiverUserId"] = receiverUserId;
		data["refType"] = "LeadReminder";
		data["refId"] = data.refId ? data.refId : "0";
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].body;
		// data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["new_lead"].image;
		data["subject"] = "Reminder Notification From " + data.assignerName;
		data["body"] = data.textMsg;
		data["type"] = "bell";
		data["status"] = "1";
		let notificationId = await notificationModel.addPushNotificationV2(data);
		return (notificationId);
	} catch (err) {

		return (err)
	}
}

module.exports.sendgamificationNotificationToUser = async (data, receiverUserId) => {
	try {

		data["receiverUserId"] = receiverUserId;
		data["refType"] = "gamificationNotification";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = "Gamification, Challange Notification";
		data["body"] = data.textMsg;
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].body;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["task"].image;
		data["type"] = "bell";
		data["status"] = "1";

		await notificationModel.addPushNotification(data);
		return true;
	} catch (err) {

		return (err)
	}
}



module.exports.sendAlertNotificationToUser = async (data, receiverUserId,subject,msgBody) => {
	try {

		data["receiverUserId"] = receiverUserId;
		data["refType"] = "gamificationNotification";
		data["refId"] = data.refId ? data.refId : "0";
		data["subject"] = subject;
		data["body"] = msgBody;
		// data["subject"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].subject;
		// data["body"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["fieldVisit_to_user"].body;
		data["image"] = notificationcontent.NOTIFICATION_DATA_WITH_IMG["task"].image;
		data["type"] = "bell";
		data["status"] = "1";

		await notificationModel.addPushNotification(data);
		return true;
	} catch (err) {

		return (err)
	}
}