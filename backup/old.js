 var debug = true;

 function debugMsg(message, data) {
     if (debug) {
         var debugText = ((typeof data === 'undefined') ? message : message + ' | ' + ((typeof data === 'object') ? JSON.stringify(data) : data));
         console.log(debugText)
     }
 }
 function searchCustomers(e,b) {
     var searchInput = document.getElementById('search_input');
     console.log(searchInput)
 }
 function populateCard(contextJSON) {

     var newDiv = document.createElement('div');
     var searchBtn = document.getElementById('search');
     searchBtn.addEventListener('click', function(e) {
         var searchInput = document.getElementById('search_input');
         console.log(searchInput.value)
    })

     if (contextJSON.data.customer.relationships && typeof contextJSON.data.customer.relationships.company != 'undefined') {
         retrieve_company_name(contextJSON.data.customer.relationships.company.data.id, contextJSON.data.customer.attributes.emails[0].email);
     } else {
         debugMsg('customer is not linked to a company');
        //  Kustomer.close();
     }
     //      newDiv.id = 'Link';
     //      newDiv.className = "mui--text-dark-secondary mui--text-body";
     //      newDiv.innerHTML =   contextJSON.data.customer.relationships.company.data.id + "  \
     //      " + JSON.stringify(contextJSON.data.customer) + "\
     //      <br/><br/>\
     //      <a href='http://www.hudl.com/technique/admin/accounts?email=" + contextJSON.data.customer.attributes.emails[0].email + "' target='tech_admin'>Find User in Technique Admin</a>";
     //      $("#container").append(newDiv);
     //      if (contextJSON.data.customer.attributes.emails.length > 0 ) {
     //        $(".mainCard").removeClass("hidden");
     //      }


     function retrieveCustomers(customerEmail) {

     }

     function retrieve_company_name(companyId, currentCustomerEmail) {
         debugMsg('retrieve_company_name', companyId);
         Kustomer.request({
             url: '/v1/companies/' + companyId,
             method: 'get'
         }, function (err, company) {
             if (err) {
                 return;
             }
             debugMsg('company name', company.attributes.name);
             retrieve_employees(company.attributes.name, currentCustomerEmail);
         });
     }

     function retrieve_employees(companyName, currentCustomerEmail) {
         debugMsg('the company is:', companyName);
         debugMsg('testJson Search', {
             "and": [{
                 "company_name": {
                     "equals": companyName
                 }
             }]
         });
         Kustomer.request({
             url: '/v1/customers/search/',
             method: 'post',
             body: {
                 "and": [{
                     "company_name": {
                         "equals": companyName
                     }
                 }, {
                     "customer_email": {
                         "not_contains": currentCustomerEmail
                     }
                 }],
                 "or": []
             }
         }, function (err, employees) {
             if (err) {
                 return;
             }
             debugMsg('employees', employees);
             if (employees.length > 0) {
                 debugMsg('multiple_employees', employees.length);
                 $("#company_card_header").html("<i class='mdi mdi-domain'></i>&nbsp;" + companyName);
                 $("#company_card_meta").html((employees.length + 1) + " Employees");
                 employees.forEach(function (employee) {
                     $("#company_employee_container").append("<div id='emp_" + employee.id + "' class='employee_summary'>" +
                         "<a class='employeeName' target='_top' href='" + Kustomer._targetOrigin + "/app/customers/" + employee.id + "'><i class='mdi mdi-account-box-outline'></i>&nbsp;" + employee.attributes.displayName + "&nbsp;&nbsp;&nbsp;</a>" +
                         "<span class='convo_count open_convo red'>" + employee.attributes.conversationCounts.open + "&nbsp;</span>" +
                         "<span class='convo_count snoozed_convo orange'>" + employee.attributes.conversationCounts.snoozed + "&nbsp;</span>" +
                         "<span class='convo_count done_convo green'>" + employee.attributes.conversationCounts.done + "&nbsp;</span>" +
                         "</div><hr class='hr' />");

                     //Iterate through customers with open conversations
                     debugMsg('converations for customer for ', employee.attributes.displayName);
                     if (employee.attributes.conversationCounts.open > 0) {
                         Kustomer.request({
                             url: '/v1/customers/' + employee.id + '/conversations/',
                             method: 'get'
                         }, function (err, conversations) {
                             if (err) {
                                 return;
                             }
                             debugMsg(employee.attributes.displayName + ' converations', conversations);


                             for (var i = 0; i < Math.min(conversations.length, 3); i++) {
                                 $("#emp_" + employee.id).append("<div class='convo_summary'>" +
                                     "<a target='_top' class='convoTitle convoStatus_" + conversations[i].attributes.status + "' href='" + Kustomer._targetOrigin + "/app/customers/" + employee.id + "/event/" + conversations[i].id + "'>" + conversations[i].attributes.name + "</a>" +
                                     "<span class='updated timeStamp'>" + moment(conversations[i].attributes.updatedAt).fromNow() + "</span>" +
                                     "</div>");


                             }
                             if (conversations.length > 3) {
                                 $("#emp_" + employee.id).append("<div class='convo_overflow'>" +
                                     "<a target='_top' href='" + Kustomer._targetOrigin + "/app/customers/" + employee.id + "'>+ " + (conversations.length - 3) + " more</a>" +
                                     "</div>");
                             }


                         });
                     } else {
                         $("#emp_" + employee.id).append("<div class='convo_overflow'>" +
                             "No open conversations" +
                             "</div>");
                     }
                     //End Iterating through customers with open conversations


                 });



             } else {
                 debugMsg('no additional employees');
                 Kustomer.close();
             }
         });
     }



     //if (contextJSON.data.length > 0 ) {
     //  $(".mainCard").removeClass("hidden");
     //}
 }




 $(function () {
     //  console.log("document loaded");

     try {

         Kustomer.initialize(function (data) {
             debugMsg(data);
             populateCard({
                 data: data
             });
         });


     } catch (e) {
         console.log(e);
         var testData = {
             "data": {
                 "customer": {
                     "attributes": {
                         "emails": [{
                             "email": "test@test.com"
                         }]
                     }
                 }
             }
         };
         populateCard(testData);
     }

 });