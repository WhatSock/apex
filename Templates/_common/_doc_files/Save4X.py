file_path = "./4X/4X.js"
with open(file_path, 'r') as file:
    file_content = file.read()
updated_content = file_content.replace('moduleFolder:"/4X/Modules/"', 'moduleFolder:"/4X/Min/"')
with open(file_path, 'w') as file:
    file.write(updated_content)
print("The file has been updated and saved.")