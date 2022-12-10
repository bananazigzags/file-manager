# :file_folder: File Manager

### This app allows you to:  
Perform basic file operations (copy, move, delete, rename, etc.)  
Get information about the host machine operating system  
Perform hash calculations  
Compress and decompress files  

## Technical requirements

Use 18 LTS version of Node.js  

The program is started by npm-script start in following way:  
```
npm run start -- --username=your_username
```
## List of operations and their syntax:  
### Navigation & working directory (nwd)  
Go upper from current directory ```up```  
Go to dedicated folder from current directory (path_to_directory can be relative or absolute) ```cd path_to_directory```  
Print in console list of all files and folders in current directory ```ls```  
### :file_folder: Basic operations with files  
Read file and print its content in console ```cat path_to_file```  
Create empty file in current working directory ```add new_file_name```  
Rename file ```rn path_to_file new_filename```  
Copy file ```cp path_to_file path_to_new_directory```  
Move file: ```mv path_to_file path_to_new_directory```  
Delete file: ```rm path_to_file```  
### :computer: Operating system info (prints following information in console)  
Get EOL (default system End-Of-Line) ```os --EOL```  
Get host machine CPUs info ```os --cpus```  
Get home directory and print it to console ```os --homedir```  
Get current system user name ```os --username```  
Get CPU architecture ```os --architecture```  
### :lock: Hash calculation
Calculate hash for file and print it into console ```hash path_to_file```  
### :books: Compress and decompress operations
Compress file (using Brotli algorithm) ```compress path_to_file path_to_destination```  
Decompress file (using Brotli algorithm) ```decompress path_to_file path_to_destination```  
