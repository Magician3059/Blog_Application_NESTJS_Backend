// Multer storage engine for saving files to disk
import { diskStorage } from 'multer';

// Node.js utility to extract file extension (.jpg, .pdf, etc.)
import { extname } from 'path';

// Centralized Multer configuration object
export const multerConfig = {
  /**
   * storage:
   * Defines WHERE and HOW files will be stored
   */
  storage: diskStorage({
    /**
     * destination:
     * Physical directory where uploaded files will be saved
     *
     * Path is relative to project root
     * Example saved path:
     * uploads/posts/1765968310729-606081718.pdf
     */
    destination: './uploads/posts',

    /**
     * filename:
     * Controls how the uploaded file name is generated
     *
     * Params:
     *  _    → request object (unused here)
     *  file → uploaded file metadata
     *  cb   → callback to return final filename
     */
    filename: (_, file, cb) => {
      /**
       * Generate a unique value to avoid filename collision
       *
       * Date.now()      → current timestamp
       * Math.random()   → random number
       * 1e9            → large range for randomness
       */
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);

      /**
       * extname():
       * Extracts original file extension
       * Example:
       *  resume.pdf  → .pdf
       *  image.png   → .png
       */
      const extension = extname(file.originalname);

      /**
       * cb(null, filename):
       * 1st arg → error (null = no error)
       * 2nd arg → final filename saved on disk
       */
      cb(null, unique + extension);
    },
  }),

  /**
   * limits:
   * Restricts file upload size and protects server memory
   */
  limits: {
    /**
     * Maximum file size allowed (in bytes)
     *
     * 2 * 1024 * 1024 = 2 MB
     */
    fileSize: 2 * 1024 * 1024,
  },
};
