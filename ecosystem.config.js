module.exports = {
    apps : [{
      name: 'moderna-propiedades-web',
      script: 'server.js',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      combine_logs: true,
      merge_logs: true,
      log_date_format: 'DD-MM-YYYY HH:mm:ss',
    }],
  };
  