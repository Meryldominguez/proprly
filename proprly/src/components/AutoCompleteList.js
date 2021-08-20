import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/core/Autocomplete';
import { v4 as uuid } from 'uuid';

const filter = createFilterOptions();

const AutoCompleteList = ({
  required, value, setValue, label, options, title, val, suggestable,
}) => (
  <Autocomplete
    disableClearable={required}
    value={value}
    onChange={(event, newValue) => setValue(newValue)}
    filterOptions={(options, params) => {
      const filtered = filter(options, params);

      if (suggestable) {
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            name: `Add "${inputValue}"`,
          });
        }
      }
      return filtered;
    }}
    selectOnFocus
    clearOnBlur
    handleHomeEndKeys
    options={options}
    getOptionLabel={(option) => {
      // Add "xxx" option created dynamically
      if (option.inputValue) {
        return option.inputValue;
      }

      return option[title];
    }}

    renderOption={(props, option) => (
      <li
        {...props}
        value={option[val]}
        key={uuid()}
      >
        {option[title]}
      </li>
    )}
    freeSolo
    renderInput={(params) => (
      <TextField {...params} label={label} />
    )}
  />
);

export default AutoCompleteList;
