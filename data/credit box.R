library(tidyverse)

varnames <- c("LOAN_ID", "ORIG_CHN", "Seller.Name", "ORIG_RT", "ORIG_AMT", "ORIG_TRM", "ORIG_DTE"
              ,"FRST_DTE", "OLTV", "OCLTV", "NUM_BO", "DTI", "CSCORE_B", "FTHB_FLG", "PURPOSE", "PROP_TYP"
              ,"NUM_UNIT", "OCC_STAT", "STATE", "ZIP_3", "MI_PCT", "Product.Type", "CSCORE_C", "MI_TYPE", "RELOCATION_FLG")

acq <- list.files(pattern = ".txt") %>%
  lapply(read_delim, delim = "|", col_names = varnames) %>%
  bind_rows %>%
  mutate(ORIG_DTE = parse_date(ORIG_DTE, "%m/%Y"))

roundTo <- function(x,base){
  base*round(x/base)
}

creditDensity <- acq %>%
  filter(ORIG_DTE >= '2017-01-01') %>%
  mutate(DTI = roundTo(DTI, 2), FICO = roundTo(CSCORE_B, 5)) %>%
  group_by(ORIG_DTE, DTI, FICO) %>%
  count %>%
  group_by(ORIG_DTE) %>%
  mutate(Percent = 100*n / sum(n)) %>%
  filter(round(Percent, 2) > 0)

hcl <- colorspace::heat_hcl(round(100*max(creditDensity$Percent)))
creditDensity$color <- hcl[round(100*creditDensity$Percent)]

creditDensity %>%
  filter(ORIG_DTE == '2017-01-01') %>%
  ggplot(aes(DTI, FICO, color = Percent)) + geom_point()

creditDensity %>%
  select(`Origination Date` = ORIG_DTE, DTI, FICO, `Number of Loans` = n, color) %>%
  write_csv("creditDensity.csv")
