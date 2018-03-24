<?php

if (empty($_POST['submit'])) {
    echo "Form is not submitted!";
    exit;
}

if (empty($_POST["fname"]) || empty($_POST["lname"])) {
    echo "Please fill the form";
    exit;
}

$fname = $_POST["fname"];
$lname = $_POST["lname"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$startdate = $_POST["startdate"];
$enddate = $_POST["enddate"];

$to = "info@shellssgi.com,shells1072@gmail.com";

$subject = "New Form Submission!";

// $message = $fname+" "+$lname+"\n"
//     +$email+"\n"+$phone;

$message = "Name: $fname $lname
    \r\nEmail: $email
    \r\nPhone: $phone
    \r\nArrival Date: $startdate
    \r\nDeparture Date: $enddate";

// echo '<script>console.log("' . $message . '")</script>';
echo $message;

// In case any of our lines are larger than 70 characters, we should use wordwrap()
// $message = wordwrap($message, 70, "\r\n");

$headers = 'From: max.carter@codobit.com' . "\r\n" .
'Reply-To: max.carter@codobit.com' . "\r\n" .
'BCC: codobitdev@gmail.com' . "\r\n" .
'X-Mailer: PHP/' . phpversion();

// Send
mail($to, $subject, $message, $headers);

// Redirect to a thank you page
header('Location: http://shellssgi.com/thank-you.html');
