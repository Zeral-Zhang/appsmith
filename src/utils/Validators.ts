import _ from "lodash";
import {
  VALIDATION_TYPES,
  ValidationResponse,
  ValidationType,
  Validator,
} from "../constants/WidgetValidation";
import moment from "moment";

export const VALIDATORS: Record<ValidationType, Validator> = {
  [VALIDATION_TYPES.TEXT]: (value: any): ValidationResponse => {
    let parsed = value;
    if (_.isUndefined(value) || _.isObject(value)) {
      return { isValid: false, parsed: "" };
    }
    let isValid = _.isString(value);
    if (!isValid) {
      try {
        parsed = _.toString(value);
        isValid = true;
      } catch (e) {
        console.error(`Error when parsing ${value} to string`);
        console.error(e);
        return { isValid: false, parsed: "" };
      }
    }
    return { isValid, parsed };
  },
  [VALIDATION_TYPES.NUMBER]: (value: any): ValidationResponse => {
    let parsed = value;
    if (_.isUndefined(value)) {
      return { isValid: false, parsed: 0 };
    }
    let isValid = _.isNumber(value);
    if (!isValid) {
      try {
        parsed = _.toNumber(value);
        isValid = true;
      } catch (e) {
        console.error(`Error when parsing ${value} to number`);
        console.error(e);
        return { isValid: false, parsed: 0 };
      }
    }
    return { isValid, parsed };
  },
  [VALIDATION_TYPES.BOOLEAN]: (value: any): ValidationResponse => {
    let parsed = value;
    if (_.isUndefined(value)) {
      return { isValid: false, parsed: false };
    }
    let isValid = _.isBoolean(value);
    if (!isValid) {
      try {
        parsed = !!value;
        isValid = true;
      } catch (e) {
        console.error(`Error when parsing ${value} to boolean`);
        console.error(e);
        return { isValid: false, parsed: false };
      }
    }
    return { isValid, parsed };
  },
  [VALIDATION_TYPES.OBJECT]: (value: any): ValidationResponse => {
    let parsed = value;
    if (_.isUndefined(value)) {
      return { isValid: false, parsed: {} };
    }
    let isValid = _.isObject(value);
    if (!isValid) {
      try {
        parsed = JSON.parse(value);
        isValid = true;
      } catch (e) {
        console.error(`Error when parsing ${value} to object`);
        console.error(e);
        return { isValid: false, parsed: {} };
      }
    }
    return { isValid, parsed };
  },
  [VALIDATION_TYPES.ARRAY]: (value: any): ValidationResponse => {
    let parsed = value;
    try {
      if (_.isUndefined(value)) {
        return { isValid: false, parsed: [] };
      }
      if (_.isString(value)) {
        parsed = JSON.parse(parsed as string);
      }
      if (!Array.isArray(parsed)) {
        return { isValid: false, parsed: [] };
      }
      return { isValid: true, parsed };
    } catch (e) {
      console.error(e);
      return { isValid: false, parsed: [] };
    }
  },
  [VALIDATION_TYPES.TABLE_DATA]: (value: any): ValidationResponse => {
    const { isValid, parsed } = VALIDATORS[VALIDATION_TYPES.ARRAY](value);
    if (!isValid) {
      return { isValid, parsed };
    } else if (!_.every(parsed, datum => _.isObject(datum))) {
      return { isValid: false, parsed: [] };
    }
    return { isValid, parsed };
  },
  [VALIDATION_TYPES.DATE]: (value: any): ValidationResponse => {
    const isValid = moment(value).isValid();
    const parsed = isValid ? moment(value).toDate() : new Date();
    return { isValid, parsed };
  },
};
