<?php

abstract class ExceptionAsJSON extends Exception {

  abstract protected function jsonkey();

  public function toJSON() {
    return '{"'.$this->jsonkey().'":"'.addslashes($this->getMessage()).'"}';
  }

}

 ?>
