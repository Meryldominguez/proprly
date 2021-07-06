-- both test users have the password 'password'
--https://www.mockaroo.com/

INSERT INTO users (username, password, first_name, last_name, email, phone,is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com',
        '18001234567',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        '18001234567',
        TRUE)
;


INSERT INTO location (name , notes)
VALUES ('warehouse','123 easy st.'),
        ('Opera Center','456 main st.'),
        ('rehearsal studios','567 main st.'),
        ('Bay 3', 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.'),
        ('Bay 4', 'Nulla facilisi.'),
        ('Room 202', null),
        ('Room 201', 'Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.'),
        ('Theater A', null),
        ('Theater B', null),
        ('Bay 5.', 'Duis bibendum.'),
        ('Room 100', 'Duis ac nibh.'),
        ('Bay 1', 'In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl.'),
        ('Bay 2', null)
;

INSERT INTO parent_loc (parent_loc, loc_id)
VALUES (1,4),
        (1,5),
        (1,6),
        (1,7),
        (2,8),
        (2,9),
        (3,10),
        (3,11),
        (3,12),
        (3,13)
;

INSERT INTO production (title,
                       date_start,
                       date_end,
                       active,
                       notes)
VALUES ('Secured motivating groupware', 
        '2009-05-30 20:25:32', 
        '2021-12-06 13:43:21', 
        false, 
        'felis ut at dolor quis odio consequat varius integer ac leo pellentesque ultrices mattis odio donec vitae nisi nam ultrices libero non mattis pulvinar nulla pede ullamcorper augue a suscipit nulla elit'),
        ('De-engineered tertiary firmware', '2002-11-20 03:27:48', '2021-09-25 20:46:53', true, 'ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien'),
        ('Realigned logistical intranet', '2006-10-25 08:00:01', '2020-06-06 04:32:20', false, 'faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at turpis donec posuere metus vitae ipsum aliquam non mauris morbi non lectus aliquam sit amet diam in'),
        ('Customizable contextually-based architecture', '2009-02-21 20:14:29', '2020-09-25 22:36:03', false, 'proin leo odio porttitor id consequat in consequat ut nulla sed accumsan felis ut at dolor quis odio consequat varius integer ac leo pellentesque ultrices mattis odio'),
        ('Extended dedicated website', '2003-01-19 04:03:48', '2021-06-14 13:31:18', false, 'aliquam convallis nunc proin at turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor'),
        ('Quality-focused holistic paradigm', '2001-07-20 19:37:14', '2021-08-04 15:51:19', true, 'sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti'),
        ('Synchronised bi-directional open system', '2013-10-10 03:35:59', '2021-08-27 00:01:11', true, 'cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in'),
        ('Sharable intermediate extranet', '2017-10-23 18:56:51', '2021-05-13 12:52:29', true, 'suspendisse potenti nullam porttitor lacus at turpis donec posuere metus vitae ipsum aliquam non mauris morbi non lectus aliquam sit amet diam in magna bibendum imperdiet'),
        ('Multi-tiered zero tolerance alliance', '2016-05-19 10:28:11', '2020-08-25 00:42:02', true, 'vulputate luctus cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum'),
        ('Quality-focused exuding knowledge base', '2013-05-30 17:42:05', '2021-11-02 18:07:54', false, 'ligula sit amet eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate luctus cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis dis'),
        ('Integrated responsive pricing structure', null, null, false, 'a boring play'),
        ('Open-source multimedia hub', null, null, false, 'co-production'),
        ('Right-sized motivating installation', '2004-02-01 14:14:57', '2020-09-18 19:48:44', false, 'pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien'),
        ('Inverse actuating approach', '2017-04-29 05:05:00', '2021-07-30 11:41:16', false, 'massa id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi eu orci mauris lacinia sapien quis libero nullam sit amet turpis elementum'),
        ('Managed 24/7 Graphical User Interface', '2001-10-10 07:31:23', '2021-08-17 10:20:59', true, 'amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu mi nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin at turpis a pede posuere nonummy'),
        ('Multi-channelled 4th generation methodology', '2012-05-15 19:54:10', '2020-07-26 18:38:44', true, 'cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo')
;

INSERT INTO lot (name, loc_id, quantity, description, price)
VALUES ('paper', 5, null, 'Loose paper sheets', null),
        ('laptop', 2, 1, 'an old windows laptop', null),
        ('Rotary pone', 4, null, 'red rotary phone', null),
        ('Chair', 6, 4, 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.', '$5.34'),
        ('Table', 10, 2,'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.', '$9.95'),
        ('Candelabra',10 , 1, 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus.', '$7.71'),
        ('Books',1 , null, 'old, new assorted', null),
        ('Room divider', 9, 2,'Proin eu mi. Nulla ac enim.', '$8.19'),
        ('Doctors bag', 9, 1,'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.', '$2.27'),
        ('Canes', 5, 4, 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.', '$9.56'),
        ('Playing Cards', 8, null, 'collection of traditional playing cards deck', null),
        ('School desk', 7, 10,'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', '$8.46'),
        ('Coat Rack', 6, 2, 'Nam dui.', '$7.09'),
        ('Quills', 3 ,null, 'feather quills', null),
        ('Silk florals, Pink', 9, null, 'range of colors', null),
        ('Crystal punch cups', 7, 6, 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae, Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend.', '$6.10'),
        ('Crystal punch bowl', 9, 1,'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', '$5.89'),
        ('Tufted Armchair', 9, 2,'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam.', '$2.75')
;

INSERT INTO prop (lot_id, prod_id, quantity)
VALUES (18, 6, null),
        (14, 1, null),
        (10, 8, 8),
        (15, 1, null),
        (15, 4, 7),
        (6, 7, null),
        (5, 16, null),
        (10, 1, null),
        (7, 4, null),
        (5, 8,null),
        (10, 16, null),
        (16, 6, null),
        (16, 1, null),
        (4,3, null),
        (17, 1, null),
        (9, 6, 5),
        (7, 10, 3),
        (18, 16, null)
;

INSERT INTO category (title)
VALUES ('Set Dressing'),
        ('Hand Props'),
        ('Set Props'),
        ('Greens'),
        ('Personal Props'),
        ('Set Trim')
;



 