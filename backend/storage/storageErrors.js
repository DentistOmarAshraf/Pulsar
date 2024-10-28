export class MissingParamsError extends Error {
  constructor(params) {
    super(`Missing ${params}`);
    this.name = "MissingParamsError";
    this.status = 400;
  }
}

export class UserValidationError extends Error {
  constructor(error) {
    super("Validation Error");
    this.name = "ValidationError";
    this.status = 400;
    this.details = {};
    for (const field in error.errors) {
      switch (field) {
        case "email":
          this.details[field] = "Email should be a valid email address";
          break;

        case "password":
          this.details[field] = "Password should be at least 8 characters long";
          break;

        case "firstName":
          this.details[field] = "First Name Min 3 letters Max 10 letters";
          break;

        case "lastName":
          this.details[field] = "Last Name Min 3 letters Max 10 letters";
          break;
        // Add other cases as needed for additional fields
        default:
          this.details[field] = `${field} is invalid`; // Generic message for any other fields
      }
    }
  }
}

export class Unauthorized extends Error {
  constructor(param) {
    super(`Wrong E-mail or Password : Check ${param}`);
    this.name = "Unauthorized";
    this.status = 401;
  }
}

export class NotFound extends Error {
  constructor(entity) {
    super(`${entity} Not Found`);
    this.name = "NotFound";
    this.status = 404;
  }
}

export class BadRequest extends Error {
  constructor(entity) {
    super(`${entity}`);
    this.name = "BadRequest";
    this.status = 400;
  }
}
