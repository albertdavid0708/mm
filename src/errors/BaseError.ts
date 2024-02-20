export class CustomError extends Error {
	constructor(message: string, public code: number, public errorCode?: string) {
		super(message);
		this.name = "CustomError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}