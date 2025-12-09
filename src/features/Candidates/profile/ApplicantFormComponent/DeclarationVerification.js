import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Box
} from '@mui/material';
import { useFormikContext } from 'formik';
import { motion } from 'framer-motion';

const DeclarationSection = () => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = useFormikContext();
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    const willCheck = !values.acceptDeclaration;
    if (!willCheck) {
      setFieldValue('acceptDeclaration', false);
      setFieldTouched('acceptDeclaration', true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setFieldValue('acceptDeclaration', true);
      setFieldTouched('acceptDeclaration', true);
      setLoading(false);
    }, 1000);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        DECLARATION
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        I hereby declare that the information furnished above is true to the best of my knowledge
        and belief, and I fully understand that if any information given above is found false,
        my services are liable to be terminated at any time without any notification by the Management.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: values.acceptDeclaration ? 1.2 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Checkbox
                    name="acceptDeclaration"
                    checked={values.acceptDeclaration}
                    onChange={handleCheck}
                    onBlur={() => setFieldTouched('acceptDeclaration', true)}
                    color="primary"
                  />
                </motion.div>
              )}
            </Box>
          }
          label="I agree to the above declaration"
        />
      </Box>

      {touched.acceptDeclaration && errors.acceptDeclaration && (
        <Typography variant="caption" color="error">
          {errors.acceptDeclaration}
        </Typography>
      )}
    </Paper>
  );
};

export default DeclarationSection;
