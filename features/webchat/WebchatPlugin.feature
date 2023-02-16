@webchatPlugin
Feature: Webchat Plugin

    Background: Login
        Given User login to the platform as 'admin'
        Then clean active calls
        Then let user reset the trigger action
        When User deletes all previous exceptions for 'WebchatChannel_1'
        When user edit 'WebchatChannel_1' channel
        And setting 'StartChatWithoutMessage' to 'false'
        And User logout with current session

    @1489
    Scenario: Plugin Webchat - Duplicate browser
        Given user log in to the Webchat plugin and send a message with following configurations:
            | tab   | contact      | email                  |
            | first | Surbhi Gupta | gupta.surbhi@tftus.com |
        When user opens Duplicate browser tab
        And transfers the session to the new tab
        Then verify session in the original browser is successfully terminated

    @1490
    Scenario: Plugin Webchat - Send allowed file
        Given User login to the platform as 'admin'
        When user edit 'WebchatChannel_1' channel
        And setting with following configurations:
            | maxFileSize | fileFormat |
            | 5           | jpg        |
        And User logout with current session
        When User login to the platform as 'Agent_1'
        When access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        And send 'a.jpg' file and verify if 'success' 'File ready! Click to download.'
        Then validate message received successfully in 'Active' tab & 'New' status
        When validate uploaded file 'received' with 'File Ready!'
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatParent_1'
        Then customer is notified that the agent has 'left' the conversation

    @5508
    Scenario: Plugin Webchat - Send not allowed file
        Given User login to the platform as 'admin'
        When user edit 'WebchatChannel_1' channel
        And setting with following configurations:
            | maxFileSize | fileFormat |
            | 5           | jpg        |
        And User logout with current session
        And User login to the platform as 'Agent_1'
        And access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        And send 'test.png' file and verify if 'error' 'File extension not allowed. (jpg)'
        Then validate message received successfully in 'Active' tab & 'New' status
        And validate uploaded file 'not received' with 'File Transfer Failed!'
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatParent_1'
        Then customer is notified that the agent has 'left' the conversation

    @5509
    Scenario: Plugin Webchat - Send allowed file (maximum size exceeded)
        Given User login to the platform as 'admin'
        When user edit 'WebchatChannel_1' channel
        And setting with following configurations:
            | maxFileSize | fileFormat  |
            | 2           | jpg,pdf,png |
        And User logout with current session
        And User login to the platform as 'Agent_1'
        And access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        And send 'test.pdf' file and verify if 'error' 'File size exceeds maximum allowed. (2.0 MB)'
        Then validate message received successfully in 'Active' tab & 'New' status
        And validate uploaded file 'not received' with 'File Transfer Failed!'
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatParent_1'
        Then customer is notified that the agent has 'left' the conversation

    @1491
    Scenario: Plugin Webchat - Change Name
        When User login to the platform as 'Agent_1'
        And access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        And user change name 'TestName'
        Then validate message received successfully in 'Active' tab & 'New' status
        And verify if 'Contact Changed Name to "TestName"'
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatParent_1'
        Then customer is notified that the agent has 'left' the conversation
        #change name back to contact name
        When user change name 'Surbhi Gupta'

    @1492
    Scenario: Plugin Webchat - Change Language
        When User login to the platform as 'Agent_1'
        And access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        And user change language 'pt'
        And validate translation 'Alterar Nome'
        Then validate message received successfully in 'Active' tab & 'New' status
        And verify if 'Contact Changed Language to Português'
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatParent_1'
        Then customer is notified that the agent has 'saiu' the conversation

    @1493
    Scenario: Plugin Webchat - Rating
        Given User login to the platform as 'admin'
        When user edit 'WebchatChannel_1' channel
        And setting 'AllowRatingRequest' to 'true'
        And User logout with current session
        When User login to the platform as 'Agent_1'
        When access the 'Webchat Channel'
        And user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        Then validate message received successfully in 'Active' tab & 'New' status
        When user reply to received message by selecting Request rating
        Then client sends 'rating' with '4' star and 'Nice' message
        And verify 'rating' with '4' star and 'Nice' message
        When user 'close' the conversation with the subject 'WebchatParent_1'
        Then customer is notified that the agent has 'left' the conversation

    @5662
    Scenario: Plugin Webchat - Chat ID
        Given User login to the platform as 'admin'
        Given user access the webChat Manager
        When user access 'WebchatChannel_1' select edit option
        And setting 'ShowChatIdOnClient' to 'true'
        Then user access the webChat channel
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        Then verify the plugin Webchat have Chat ID information
        Then validate the Chat ID through Webchat Channel

    @5664
    Scenario: Plugin Webchat - Start Chat without message
        Given User login to the platform as 'admin'
        When user edit 'WebchatChannel_1' channel
        And setting 'StartChatWithoutMessage' to 'true'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        Then validate conversation started at 'client' side as 'Surbhi Gupta'
        And validate conversation started at 'agent' side as 'Surbhi Gupta'
        #uncheck start chat without message checkbox
        When user edit 'WebchatChannel_1' channel
        And setting 'StartChatWithoutMessage' to 'false'

    @5665
    Scenario: Plugin Webchat - Request Conversation Copy
        Given User login to the platform as 'admin'
        When user access the webChat Manager
        And verify if 'MailboxWebchat_1' exist
        When user edit 'WebchatChannel_1' channel
        And update webchat setting with:
            | Mailbox | Setting        | MailboxName      |
            | true    | ContactRequest | MailboxWebchat_1 |
        When access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                 |
            | second | Surbhi Gupta | gocontact@getnada.com |
        Then verify the plugin Webchat have Send Chat by Email
        And validate if email is sent to the client on 'gocontact@getnada.com' with a copy of conversation
        Then validate message received successfully in 'Active' tab & 'New' status
        #uncheck the checkboxes
        When user edit 'WebchatChannel_1' channel
        And update webchat setting with:
            | Mailbox | Setting        | MailboxName      |
            | false   | ContactRequest | MailboxWebchat_1 |

    @5666
    Scenario: Self Rating
        Given User login to the platform as 'admin'
        When user edit 'WebchatChannel_1' channel
        And setting 'AllowSelfRatingRequest' to 'true'
        When access the 'Webchat Channel'
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                  |
            | second | Surbhi Gupta | gupta.surbhi@tftus.com |
        Then Validate that Rate chat option available
        Then client sends 'selfrating' with '4' star and 'Great' message
        Then validate message received successfully in 'Active' tab & 'New' status
        And verify 'selfrating' with '4' star and 'Great' message

    @5667
    Scenario: Plugin Webchat - Automatically Send Conversation Copy
        Given User login to the platform as 'admin'
        When user access the webChat Manager
        And verify if 'MailboxWebchat_1' exist
        When user edit 'WebchatChannel_1' channel
        And update webchat setting with:
            | Mailbox | Setting  | MailboxName      |
            | true    | AutoSend | MailboxWebchat_1 |
        When access the 'Webchat Channel'
        And user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact      | email                 |
            | second | Surbhi Gupta | gocontact@getnada.com |
        Then validate message received successfully in 'Active' tab & 'New' status
        And user select the conversation
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatChild_1'
        Then customer is notified that the agent has 'left' the conversation
        And validate if email is sent to the client on 'gocontact@getnada.com' with a copy of conversation
        #uncheck the checkboxes
        When user edit 'WebchatChannel_1' channel
        And update webchat setting with:
            | Mailbox | Setting  | MailboxName      |
            | false   | AutoSend | MailboxWebchat_1 |

    @5678
    Scenario: Plugin Webchat - Upload CSS
        Given User login to the platform as 'admin'
        Given user access the webChat Manager
        When user access 'WebchatChannel_1' select edit option
        And user upload 'webchat.css' css file
        When user open a duplicate tab and open Webchat plugin
        Then verify the plugin Webchat has CSS Background color '#cdffd8'
        #uncheck UploadCustomWebchatCSS checkbox
        When user switch to main tab
        And user edit 'WebchatChannel_1' channel
        And setting 'UploadCustomWebchatCSS' to 'false'

    @5892
    Scenario: Webchat - Set up goodbye message when agent leaves a webchat - custom sender name
        Given User login to the platform as 'admin'
        When user access the webChat Manager
        Then user access 'WebchatChannel_1' select edit option
        Then user navigate to triggers tab and select add trigger option
        When User fill the trigger details:
            | when        | When the agent leaves the conversation |
            | action      | Send Message to Client                 |
            | delay       | 00:00:05                               |
            | displayName | true                                   |
            | sender      | Agent                                  |
            | message     | Hello World!                           |
        Then save the changes successfully
        When user access the webChat channel
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact     | email                 |
            | second | Sidra Ajmal | ajmal.sidra@tftus.com |
        Then validate message received successfully in 'Active' tab & 'New' status
        And user select the conversation
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatChild_1'
        Then customer is notified that the agent has 'left' the conversation
        Then customer verify 'Agent' name and 'Hello World!' message displayed
        When user access the webChat Manager
        Then user access 'WebchatChannel_1' select edit option
        And user deletes the '0' trigger action
        Then save the changes successfully

    @5867
    Scenario: Webchat - Set up goodbye message when agent leaves a webchat
        Given User login to the platform as 'admin'
        When user access the webChat Manager
        Then user access 'WebchatChannel_1' select edit option
        Then user navigate to triggers tab and select add trigger option
        When User fill the trigger details:
            | when        | When the agent leaves the conversation |
            | action      | Send Message to Client                 |
            | delay       | 00:00:05                               |
            | message     | Hello World!                           |
        Then save the changes successfully
        When user access the webChat channel
        When user log in to the Webchat plugin and send a message with following configurations:
            | tab    | contact     | email                 |
            | second | Sidra Ajmal | ajmal.sidra@tftus.com |
        Then validate message received successfully in 'Active' tab & 'New' status
        And user select the conversation
        When user reply to received message
        Then validate message is received in the client plugin
        When user 'close' the conversation with the subject 'WebchatChild_1'
        Then customer is notified that the agent has 'left' the conversation
        Then customer verify 'System Administrator' name and 'Hello World!' message displayed
        When user access the webChat Manager
        Then user access 'WebchatChannel_1' select edit option
        And user deletes the '0' trigger action
        Then save the changes successfully