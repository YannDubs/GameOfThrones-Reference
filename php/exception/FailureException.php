<?php

require_once("ExceptionAsJSON.php");

class FailureException extends ExceptionAsJSON {
  protected function jsonkey() {
    return 'error';
  }
}

 ?>
