use leadmanagement;

CREATE TABLE IF NOT EXISTS leads(
    	id int PRIMARY KEY AUTO_INCREMENT,
    	Name Varchar(256) NOT NULL,
    	Company VARCHAR(256) NOT NULL,
    	Mobile VARCHAR(256) NOT NULL,
    	Email VARCHAR(256) NOT NULL,
    	Category VARCHAR(20) CHECK (Status IN ('Innerwear', 'Sportswear', 'Comfortwear','Fabric','Accessories','OEM/ODM')),
    	Lead_status	VARCHAR(20) CHECK (Status IN ('New', 'Contacted', 'Follow-up','Converted','Not Interested')),
    	Follow_up_date	Date
    );