function doGet() {           

      var imageFileId = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3'; // Replace with your actual File ID

      var file = DriveApp.getFileById(imageFileId);                                                                                                               
      var resizedBlob = file.getThumbnail(); // Returns the thumbnail as a small Blob (~15KB)                                                                     
                                                                                                                                                                  
      if (!resizedBlob) {                                                                                                                                         
        throw new Error("Unable to retrieve thumbnail. Make sure the file is an image.");                                                                         
      }                                                                                                                                                           
                                                                                                                                                                  
      resizedBlob.setName("myResizedImage");                                                                                                                                                       

      var template = HtmlService.createTemplateFromFile('subscription');                                                                                         

      orderId = "YWR-1234-PREVIEW";
      // Inject mock values for previewing                                                                                                                        
      template.customerName = "Jane Doe";                                                                                                                         
      template.orderId = orderId;                                                                                                                      
      template.cost = "$499"
      template.roast = "Early Bird"
      template.size = "5lb"
      template.frequency = "Monthly"
      template.deliveryMethod = "Hand"

      GmailApp.sendEmail(
        'ianralls19@gmail.com',
        `Yellow Wing Roasters Subscription Confirmation (${orderId})`,
        `Thanks for your order! Your order number is ${orderId}`,
        {
          name: "Yellow Wing Roasters",
          from: 'orders@yellowwingroasters.com',
          htmlBody: template.evaluate().getContent(),
          inlineImages: {                                                                                                                                           
            myResizedImage: resizedBlob // Must match src="cid:myResizedImage" in email html                                                                                                                               
          }
        }                                                                                                                      
      );                                                                                                                           
    }

function onFormSubmit(e) {
    var sheet = SpreadsheetApp.getActiveSheet();                                                                                                                
    var row = e.range.getRow();
                                                                                                                            
    var lastColumn = Math.max(1, sheet.getLastColumn());                                                                                                        
    var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    var orderIdColumn = headers.indexOf("Order ID") + 1;

    // 4. Calculate the sequential ID                                                                                                                           
    var startId = 1000;                                                                                                                                         
    var orderId = startId + row - 1;  
    // 5. Write the order ID to the correct column                                                                                                              
    sheet.getRange(row, orderIdColumn).setValue(orderId);

    var customerEmail = e.namedValues['Email'][0].toString().trim();                                                                                            
    var roast = e.namedValues['Roast'][0].toString().trim();                                                                                                    
    var cost = e.namedValues['Price'][0].toString().trim();                                                                                                    
    var size = e.namedValues['Size'][0].toString().trim();                                                                                                    
    var deliveryMethod = e.namedValues['Delivery Method'][0].toString().trim();                                                                                 
    var notes = e.namedValues['Notes'][0].toString().trim();
    var frequency = e.namedValues['Frequency'][0].toString().trim();

    console.log("VALUES: " + customerEmail + ", " + roast + ", " + cost + ", " + deliveryMethod + ", " + notes + ", " + orderId);

    var imageFileId = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3'; // Replace with your actual File ID

    var file = DriveApp.getFileById(imageFileId);                                                                                                               
    var resizedBlob = file.getThumbnail(); // Returns the thumbnail as a small Blob (~15KB)                                                                     
                                                                                                                                                                
    if (!resizedBlob) {                                                                                                                                         
      throw new Error("Unable to retrieve thumbnail. Make sure the file is an image.");                                                                         
    }                                                                                                                                                           
                                                                                                                                                                
    resizedBlob.setName("myResizedImage");    

    var template = HtmlService.createTemplateFromFile('subscription');
    // Inject variables into the template                                                                                                                         
    template.orderId = orderId;                                                                                                                                   
    template.cost = cost;
    template.roast = roast;
    template.size = size;
    template.frequency = frequency;
    template.deliveryMethod = deliveryMethod;

    // Compile/evaluate the template                                                                                                                              
    var htmlBody = template.evaluate().getContent();  

    try {
      GmailApp.sendEmail(
        customerEmail,
        `Yellow Wing Roasters Subscription Confirmation (${orderId})`,
        `Thanks for your order! Your order number is ${orderId}`,
        {
          name: "Yellow Wing Roasters",
          from: 'orders@yellowwingroasters.com',
          htmlBody: htmlBody,
          inlineImages: {                                                                                                                                           
            myResizedImage: resizedBlob // Must match src="cid:myResizedImage" in email html                                                                                                                               
          }
        }                                                                                                                      
      );

      console.log("YAY! Sent to " + customerEmail);
    } catch (mailError) {
      console.error("Failed to send email to " + customerEmail + ". Error detail: " + mailError.toString());
    }
  }
