class APIERROR extends Error {
	constructor(message, statusCode) {
		super(message || 'Something Went Wrong');
		this.statusCode = statusCode || 500;
	}
}

module.exports = APIERROR;
