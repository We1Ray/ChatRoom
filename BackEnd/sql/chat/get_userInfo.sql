select
	a.account_uid,
	a.account,
	a.name || ' (' || a.account || ')' name,
	a.email
from
	account_token at2 ,
	accounts a
where
	a.account_uid = at2.account_uid
	and at2 .access_token = ${token}