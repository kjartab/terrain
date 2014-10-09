<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
require_once('includes/api.lib.php');
require_once('includes/DatabaseHelper.php');
require_once('includes/DatabaseRestricted.php');
require_once('includes/db.php');


	$requestObj = new Controller();
	$dbHelper = new DatabaseHelper($db);
	$dbWriter = new DatabaseRestricted($db);
	$request = $requestObj->getRequest();

		
		$data = $requestObj->getData();
		switch( $requestObj->getMethod() ) {
			case 'get':
				
				$request = explode("/", $_SERVER['REQUEST_URI'] );
				
				$dbHelper->connect();
				
				$res = '';
				
				
				switch($request[3]) {
					case 'rastersbin':
						$res = $dbHelper->getPngDemBin($_GET['outline'],$_GET['table']);
						header("Content-Type': 'application/octet-stream");
						//header("Content-type: image/png"); 
						echo $res;
					
					break;
					
					case 'rasterspng':
						$res = $dbHelper->getPngDemBin($_GET['outline'],$_GET['table']);
						//header("Content-Type': 'application/octet-stream");
						header("Content-type: image/png"); 
						echo $res;
					
					break;
					
					
					case 'rasters':
						$res = $dbHelper->getPngDem($_GET['outline'],$_GET['table']);
						header("Content-type: image/png"); 
						echo $res;
					
					break;
								
					case 'rasteroverview':
						$res = $dbHelper->getRasterDataSets();
						echo $res;
					
					break;
				}
				break;
				
			case 'post':
				
					Controller::respond(404);
				

				break;
				
			case 'put':
				break;
				
			case 'delete':
				break;
				
			default:
				Controller::respond( 405 );
				break;

		}
	
	exit;