export default interface ErrorService {
    provincia: Error;
    canton:    Error;
    distrito:  Error;
}

export interface Error {
    error:        string;
    enabledError: boolean;
}