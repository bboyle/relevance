// load scripts
(function() {

	var jqueryVersion = /(^|[?&])jquery=/.test( decodeURIComponent( window.location.search )) ? 
						decodeURIComponent( window.location.search ).replace( /^.*jquery=([0-9\.]+).*$/, '$1' ) : '1.7.2',
		scripts = [
			'lib/jquery-' + jqueryVersion + '-min.js',
			'src/jquery.forces.relevance.js'
		],
		i, s
	;

	for ( i = 0 ; i < scripts.length; i++ ) {
		// TODO use DOM instead of document.write
		document.write( '<script src="../' + scripts[ i ] + '"></script>' );
	}


}());
