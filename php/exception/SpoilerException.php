<?php

require_once("ExceptionAsJSON.php");

class SpoilerException extends ExceptionAsJSON {
  protected function jsonkey() {
    return 'spoiler';
  }
}

 ?>
