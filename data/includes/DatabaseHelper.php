<?php
	
Class DatabaseHelper {
		
	private $host;
	private $port;
	private $dbname;
	private $user;
	private $password;	
	private $dbconn;
	private $dbresult;
	private $dbArray;
	
	
    public function __construct($db) {
		$this->dbArray = $db;
	}
	
	public function connect() {	
		if ($this->dbconn == null) {
			$this->dbconn = pg_connect($this->dbArray['connectionString']);
		} else {
			echo 'connection already established';	
		}
	}
	

	private function transformResult($dbres) {
		$data = array();
		while ($row = pg_fetch_row($dbres)) {
			$data[] = $row;
		}
		return json_encode($data);
	}
	
	public function getRasterDataSets() {	
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT ST_AsGeoJson(ST_Transform(ST_Envelope(rast),4236)) from vestlandet32;');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
		
	public function getPngDem($polygon,$table) {	
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT ST_AsGDALRaster((SELECT ST_ReClass(ST_Clip(rast,ST_Envelope(ST_Transform(ST_GeomFromText(\''.$polygon.'\',4236),32632)),true),1,\'200-1600:0-255\',\'32BF\') from vestlandet32 WHERE ST_Intersects(rast,ST_Transform(ST_Envelope(ST_GeomFromText(\''.$polygon.'\',4236)),32632))),\'PNG\')');
				
			

	if ($dbresult === false) {
				return 'test';
			}
		}
		
		$row = pg_fetch_row($dbresult);
		pg_free_result($dbresult);
		if ($row === false) return;
		return pg_unescape_bytea($row[0]);
		//return 'test';
	}
	
		public function getPngDemBin($polygon,$table) {	
		$dbresult;
		if ($this->dbconn) {
								
			$dbresult = @pg_query(
			'WITH raster as (SELECT ST_ReClass(ST_Clip(rast,ST_Envelope(ST_Transform(ST_GeomFromText(\''.$polygon.'\',4236),32632)),true),1,\'0-2000:0-32535\',\'16BUI\') ra from sunnfjordterrain WHERE ST_Intersects(rast,ST_Transform(ST_Envelope(ST_GeomFromText(\''.$polygon.'\',4236)),32632))
			)		
			SELECT ST_AsGDALRaster(ST_ReSample(ra,250,250,0,0,0,0,\'algorithm=Bilinear\',0.125),\'ENVI\') from raster');
			//SELECT ST_AsGDALRaster(ra,\'PNG\') from raster');
		
			
			
			
			
			
			
			

	
			//$dbresult = @pg_query('SELECT ST_AsGDALRaster((SELECT ST_Clip(rast,ST_MakeEnvelope(299800, 6749800,302000, 6752000,32632),true) from sunnfjordterrain WHERE ST_Intersects(rast,ST_MakeEnvelope(299800, 6749800,302000, 6752000,32632))),\'PNG\')');
			//$dbresult = @pg_query('SELECT ST_AsGDALRaster((SELECT ST_ReClass(ST_Clip(rast,ST_Transform(ST_Envelope(ST_GeomFromText(\''.$polygon.'\',4236)),32632),true),1,\'0-2000:0-32767\',\'32BF\') from sunnfjordterrain WHERE ST_Intersects(rast,ST_Transform(ST_Envelope(ST_GeomFromText(\''.$polygon.'\',4236)),32632))),\'ENVI\')');
		if ($dbresult === false) {
				return 'test';
			}
		}
		
		$row = pg_fetch_row($dbresult);
		pg_free_result($dbresult);
		if ($row === false) return;
		return pg_unescape_bytea($row[0]);
		//return 'test';
	}
	
}


?>