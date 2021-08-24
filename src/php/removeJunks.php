<?php
//The URL with parameters / query string.
$url = 'https://api.robomotion.com.pl/device/removeJunks';
 

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => "secret: sVd8h88mCNWzdk7MKdTwSGb3sBPVAjbH\r\n",
        'method'  => 'GET'
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

var_dump($result);
?>